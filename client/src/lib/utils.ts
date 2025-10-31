import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  today,
  getLocalTimeZone,
  type CalendarDate,
} from "@internationalized/date";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Calculates age from a birthday date using @internationalized/date.
 * @param birthday - Birthday date as a CalendarDate object
 * @returns The age as a number (integer)
 */
export function calculateAge(birthday: CalendarDate): number {
  const currentDate = today(getLocalTimeZone());

  let age = currentDate.year - birthday.year;

  if (
    currentDate.month < birthday.month ||
    (currentDate.month === birthday.month && currentDate.day < birthday.day)
  ) {
    age--;
  }

  return age;
}
