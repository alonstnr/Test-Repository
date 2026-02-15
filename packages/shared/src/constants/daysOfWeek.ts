export enum DayOfWeek {
  SUNDAY = 'SUNDAY',
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
}

export const dayOfWeekLabels: Record<DayOfWeek, string> = {
  [DayOfWeek.SUNDAY]: 'ראשון',
  [DayOfWeek.MONDAY]: 'שני',
  [DayOfWeek.TUESDAY]: 'שלישי',
  [DayOfWeek.WEDNESDAY]: 'רביעי',
  [DayOfWeek.THURSDAY]: 'חמישי',
  [DayOfWeek.FRIDAY]: 'שישי',
  [DayOfWeek.SATURDAY]: 'שבת',
};

export const dayOfWeekShortLabels: Record<DayOfWeek, string> = {
  [DayOfWeek.SUNDAY]: "א'",
  [DayOfWeek.MONDAY]: "ב'",
  [DayOfWeek.TUESDAY]: "ג'",
  [DayOfWeek.WEDNESDAY]: "ד'",
  [DayOfWeek.THURSDAY]: "ה'",
  [DayOfWeek.FRIDAY]: "ו'",
  [DayOfWeek.SATURDAY]: 'ש',
};
