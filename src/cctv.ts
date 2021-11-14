import path from 'path';
import ffmpeg from 'ffmpeg-static';
import fsAsync from 'fs/promises';
import { exec } from 'child_process';

import shell from 'any-shell-escape';
import dayjs, { Dayjs } from 'dayjs';

import createDirAsync from './helpers/createDirAsync';
import removeDirAsync from './helpers/removeDirAsync';

import {
  deleteSegmentsAgeMins, deleteSegmentsIntervalMins, host, password, mergeProcessesArray,
  recordingsPath, segmentSecs, segmentsPath, segmentsToMergeFile, username,
} from './globals';

const cctv = async () => {
  let previousHour: Dayjs = dayjs().startOf('hour');

  await createDirAsync(segmentsPath, true);

  const url = `rtmp://${host}/bcs/channel0_main.bcs?channel=0&stream=0&user=${username}&password=${password}`;
  const segmentsCommand = shell([
    ffmpeg,
    '-i', url,
    '-acodec', 'copy',
    '-vcodec', 'copy',
    '-f', 'segment',
    '-strftime', '1',
    '-segment_time', segmentSecs,
    '-segment_format', 'mp4',
    '-reset_timestamps', '1',
    path.join(segmentsPath, '%Y-%m-%d_%H-%M-%S.mp4'),
  ]);

  const segmentsProcess = exec(segmentsCommand, { maxBuffer: 1024 * 1024 })
    .on('spawn', () => {
      console.error('Process started');
    })
    .on('error', (err) => {
      console.error('Segments command error: ', err);
    });

  const mergeClips = async () => {
    const currentHour = dayjs().startOf('hour');

    // start merging previous hour segments
    if (currentHour.isAfter(previousHour)) {
      await removeDirAsync(segmentsToMergeFile);
      const filesToMerge: Array<string> = [];

      const segments = await fsAsync.readdir(segmentsPath);
      for (let i = 0; i < segments.length; i++) {
        const segment = segments[i];
        const filePath = path.join(segmentsPath, segment);

        try {
          // eslint-disable-next-line no-await-in-loop
          const { ctime } = await fsAsync.stat(filePath);
          const fileCreatedAt = dayjs(ctime);

          if (fileCreatedAt.startOf('hour').isSame(previousHour)) {
            filesToMerge.push(segment);
          }

          // file might not exist anymore
        } catch { }
      }

      if (filesToMerge.length) {
        await fsAsync.writeFile(
          segmentsToMergeFile,
          filesToMerge
            .map((file: string) => (
              `file ${path.join(segmentsPath, file).replace(/\\/gm, '/')}`
            ))
            .join('\n'),
        );

        const curRecordPath = path.join(
          recordingsPath,
          previousHour.year().toString(),
          (previousHour.month() + 1).toString(),
          previousHour.date().toString(),
        );

        await createDirAsync(curRecordPath, true);

        const recordFile = path.join(
          curRecordPath,
          `${previousHour.format('YYYY-DD-MM_HH-mm-ss')}.mp4`,
        );

        try {
          const command = shell([
            ffmpeg,
            '-f', 'concat',
            '-safe', 0,
            '-i', segmentsToMergeFile,
            '-acodec', 'copy',
            '-vcodec', 'copy',
            recordFile,
          ]);

          const mergeProcess = exec(command)
            .on('spawn', () => {
              mergeProcessesArray.push(mergeProcess);
            })
            .on('exit', async () => {
              await removeDirAsync(segmentsToMergeFile);
            })
            .on('error', (err) => {
              console.error('Merging command error: ', err);
            });
        } catch (ex) {
          console.error('ex: ', ex);
        }
      }

      previousHour = currentHour;
    }
  };

  const deleteSegments = async () => {
    let deleteCount = 0;
    const segments = await fsAsync.readdir(segmentsPath);
    for (let i = 0; i < (segments || []).length; i++) {
      const segment = segments[i];
      const filePath = path.join(segmentsPath, segment);

      try {
        // eslint-disable-next-line no-await-in-loop
        const { ctime } = await fsAsync.stat(filePath);
        const fileCreatedAt = dayjs(ctime);

        if (fileCreatedAt.add(deleteSegmentsAgeMins, 'minutes').isBefore(dayjs())) {
          // eslint-disable-next-line no-await-in-loop
          const removed = await removeDirAsync(filePath);
          if (removed) {
            deleteCount++;
          }
        }

        // file might not exist anymore
      } catch { }
    }

    if (deleteCount) {
      console.log(`Deleted ${deleteCount} segments`);
    }
  };

  setInterval(mergeClips, segmentSecs * 1000);
  setInterval(deleteSegments, deleteSegmentsIntervalMins * 60 * 1000);

  return segmentsProcess;
};

export default cctv;
