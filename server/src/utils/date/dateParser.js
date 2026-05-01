import { ApiError } from '../core/ApiError.js';

export const parseDateUTC = ({ dateStr }) => {
  if (!dateStr) throw new ApiError(400, 'Date string is required');

  const [year, month, day] = dateStr.split('-').map(Number);

  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    throw new ApiError(400, 'Invalid date format. Expected YYYY-MM-DD.');
  }

  const parsed = new Date(Date.UTC(year, month - 1, day));

  if (isNaN(parsed.getTime())) {
    throw new ApiError(400, 'Invalid date value');
  }

  return parsed;
};

export const getStartOfDayUTC = ({ date }) => {
  const start = new Date(date);
  start.setUTCHours(0, 0, 0, 0);
  return start;
};

export const getEndOfDayUTC = ({ date }) => {
  const end = new Date(date);
  end.setUTCHours(23, 59, 59, 999);
  return end;
};

// helping function for barber controller api [23]
export const getLast7DaysUTC = ({ inputDate = new Date() }) => {
  const d = new Date(inputDate);
  d.setUTCDate(d.getUTCDate() - 6);
  d.setUTCHours(0, 0, 0, 0);
  return d;
};

// helping function for user conntroller api [6]
export const combineDateAndTimeUTC = ({ date, time }) => {
  if (!date || !time) return null;

  const d = new Date(date);
  const t = new Date(time);

  if (isNaN(d) || isNaN(t)) return null;

  const combined = new Date(
    Date.UTC(
      d.getUTCFullYear(),
      d.getUTCMonth(),
      d.getUTCDate(),
      t.getUTCHours(),
      t.getUTCMinutes(),
      t.getUTCSeconds(),
      t.getUTCMilliseconds(),
    ),
  );

  return combined;
};
