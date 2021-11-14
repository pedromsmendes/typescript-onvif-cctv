import { ChildProcess } from 'child_process';
import path from 'path';

export const mergeProcessesArray: ChildProcess[] = [];

export const segmentSecs = +process.env.SEGMENTS_SEC!;
export const deleteSegmentsAgeMins = +process.env.DELETE_SEGMENTS_OLD_MINS!;
export const deleteSegmentsIntervalMins = +process.env.DELETE_SEGMENTS_INTERVAL_MINS!;
export const recordingsPath = path.join(process.cwd(), 'recordings');
export const segmentsPath = path.join(process.cwd(), 'segments');
export const segmentsToMergeFile = path.join(segmentsPath, 'segmentsToMerge.txt');

export const host = process.env.CAM_HOST!;
export const username = process.env.CAM_USERNAME!;
export const password = process.env.CAM_PASSWORD!;
