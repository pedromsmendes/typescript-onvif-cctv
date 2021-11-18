import { MotionDetector } from 'node-onvif-events';

import {
  hostname, username, password, port,
} from './globals';

const motionDetection = async () => {
  const detector = await MotionDetector.create(1, {
    hostname,
    username,
    password,
    port,
  });

  console.log('>> Motion detection activated');
  detector.listen((motion) => {
    if (motion) {
      console.log('>> Motion Detected');
    } else {
      console.log('>> Motion Stopped');
    }
  });

  return detector;
};

export default motionDetection;
