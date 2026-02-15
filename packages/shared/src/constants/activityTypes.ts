export enum ActivityType {
  HARVESTING = 'HARVESTING',
  REHABILITATION = 'REHABILITATION',
  RENOVATION = 'RENOVATION',
  ELDERLY_HELP = 'ELDERLY_HELP',
  DISABLED_CHILDREN_HELP = 'DISABLED_CHILDREN_HELP',
  ANIMAL_CARE = 'ANIMAL_CARE',
  FOOD_DISTRIBUTION = 'FOOD_DISTRIBUTION',
  TUTORING = 'TUTORING',
  ENVIRONMENT = 'ENVIRONMENT',
  COMMUNITY = 'COMMUNITY',
  OTHER = 'OTHER',
}

export const activityTypeLabels: Record<ActivityType, string> = {
  [ActivityType.HARVESTING]: 'קטיף',
  [ActivityType.REHABILITATION]: 'שיקום פצועים',
  [ActivityType.RENOVATION]: 'שיפוץ',
  [ActivityType.ELDERLY_HELP]: 'עזרה לקשישים',
  [ActivityType.DISABLED_CHILDREN_HELP]: 'עזרה לילדים עם מוגבלויות',
  [ActivityType.ANIMAL_CARE]: 'טיפול בבעלי חיים',
  [ActivityType.FOOD_DISTRIBUTION]: 'חלוקת מזון',
  [ActivityType.TUTORING]: 'חונכות',
  [ActivityType.ENVIRONMENT]: 'איכות הסביבה',
  [ActivityType.COMMUNITY]: 'קהילה',
  [ActivityType.OTHER]: 'אחר',
};
