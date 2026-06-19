import { randomBytes } from "node:crypto";

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function generateToken(bytes = 32): string {
  return randomBytes(bytes).toString("hex");
}

export function centsToAmount(cents: number): number {
  return cents / 100;
}

export function amountToCents(amount: number): number {
  return Math.round(amount * 100);
}

export function toDecimalCents(cents: number): number {
  return Math.round(cents);
}

export function sum(values: number[]): number {
  return values.reduce((acc, value) => acc + value, 0);
}

export function isWithinHours(date: Date, hours: number): boolean {
  return date >= new Date(Date.now() - hours * 3_600_000);
}

export function hoursFromNow(hours: number): Date {
  return new Date(Date.now() + hours * 3_600_000);
}

export function minutesFromNow(minutes: number): Date {
  return new Date(Date.now() + minutes * 60_000);
}

export function omit<T extends object, K extends keyof T>(obj: T, ...keys: K[]): Omit<T, K> {
  const result = { ...obj };
  for (const key of keys) {
    delete result[key];
  }
  return result;
}

export function pick<T extends object, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    result[key] = obj[key];
  }
  return result;
}

export {
  dayOfWeekFromDateKey,
  parseDateKeyParts,
  startAtMatchesWallClock,
  wallClockDayBounds,
  wallClockToInstant,
} from "@/server/modules/shared/helpers/calendarDate";
