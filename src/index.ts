import { exit } from 'process';
import cctv from './cctv';
import { mergeProcessesArray } from './globals';

import validateVariables from './helpers/validateVariables';
import motionDetection from './motionDetection';

(async () => {
  validateVariables();

  const cctvProcess = await cctv();

  const motionProcess = await motionDetection();

  const closeProcesses = () => {
    cctvProcess.kill();
    motionProcess.close();
    mergeProcessesArray.forEach((process) => {
      process.kill();
    });
  };

  // exit: app closing
  // SIGINT: ctrl + c
  // SIGUSR1/2: kill pid (eg: nodemon)
  // uncaughtException: well, self explanatory
  ['exit', 'SIGINT', 'SIGUSR1', 'SIGUSR2', 'uncaughtException']
    .forEach((eventType) => {
      cctvProcess.on(eventType, closeProcesses);
    });
})()
  .catch((appError) => {
    console.error('\nAPP CRASH\n', appError);
    exit();
  });
