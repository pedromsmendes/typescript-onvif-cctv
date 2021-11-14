declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      CAM_HOST: string;
      CAM_PORT: number;
      CAM_USERNAME: string;
      CAM_PASSWORD: string;
      SEGMENTS_SEC: number;
      DELETE_SEGMENTS_OLD_MINS: number;
      DELETE_SEGMENTS_INTERVAL_MINS: number;
    }
  }
}

export { };
