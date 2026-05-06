import { ApiError } from '../utils/index.js';

export const parseAndValidateId = ({ value, name = 'Id' }) => {
  const parsed = Number(value);
  if (!parsed || Number.isNaN(parsed)) throw new ApiError(400, `Valid ${name} is required`);
  return parsed;
};

export const validateTimeRange = ({ startTime, endTime }) => {
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  if (startTime && !timeRegex.test(startTime))
    throw new ApiError(400, 'startTime must be HH:MM format');
  if (endTime && !timeRegex.test(endTime)) throw new ApiError(400, 'endTime must be HH:MM format');
  if (startTime && endTime && startTime >= endTime)
    throw new ApiError(400, 'Start time must be before end time');
};
