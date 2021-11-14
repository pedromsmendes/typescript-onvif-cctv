import ValidationError from '../ValidationError';

const validateVariables = () => {
  const errorMsgs: string[] = [];

  if (!process.env.CAM_HOST) {
    errorMsgs.push('Missing "CAM_HOST" variable');
  }
  if (!process.env.CAM_USERNAME) {
    errorMsgs.push('Missing "CAM_USERNAME" variable');
  }
  if (!process.env.CAM_PASSWORD) {
    errorMsgs.push('Missing "CAM_PASSWORD" variable');
  }
  if (!process.env.SEGMENTS_SEC) {
    errorMsgs.push('Missing "SEGMENTS_SEC" variable');
  }
  if (!process.env.DELETE_SEGMENTS_OLD_MINS) {
    errorMsgs.push('Missing "DELETE_SEGMENTS_OLD_MINS" variable');
  }
  if (!process.env.DELETE_SEGMENTS_INTERVAL_MINS) {
    errorMsgs.push('Missing "DELETE_SEGMENTS_INTERVAL_MINS" variable');
  }

  if (errorMsgs.length) {
    throw new ValidationError(errorMsgs);
  }
};

export default validateVariables;
