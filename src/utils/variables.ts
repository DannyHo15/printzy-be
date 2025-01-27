export const DEFAULT_PAGINATION_LIMIT = 100;

export const DEFAULT_PAGINATION_SKIP = 0;

export const SECOND_MS = 1000;

export const MINUTE_MS = SECOND_MS * 60;

export const HOUR_MS = MINUTE_MS * 60;

export const DAY_MS = HOUR_MS * 24;

export const WEEK_MS = DAY_MS * 7;

export const MONTH_MS = DAY_MS * 31;

export const jwtExpiresIn = '30d';

export const MIN_PASSWORD_LENGTH = 7;

export const KOPECKS_IN_RUBLE = 100;

export const ORDER_STATUSES = [
  'processing',
  'delivery',
  'completed',
  'cancelled',
] as const;

export enum ERole {
  ADMIN = 'admin',
  CLIENT = 'client',
  EMPLOYEE = 'employee',
}

export enum EGender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}
