import {
  getBookingTimezoneOffsetMinutes,
  wallClockToInstant,
} from "@/client/modules/shared/helpers/calendarDate.js";

/** Build ISO `startAt` from the customer's selected wall-clock date and time. */
export function buildStartAt(dateKey, timeId, timezoneOffsetMinutes = getBookingTimezoneOffsetMinutes()) {
  return wallClockToInstant(dateKey, timeId, timezoneOffsetMinutes).toISOString();
}
