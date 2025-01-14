export interface IFieldQuery<T> {
  $eq?: T;
  $ne?: T;
  $lt?: T;
  $gt?: T;
  $gte?: T;
  $lte?: T;
  $iLike?: T;
  $nin?: T[];
  $in?: T[];
  $btw?: [T, T];
}

export interface IQuery {
  $limit?: number;
  $skip?: number;

  $or?: {
    [key: string]: any | IFieldQuery<any>;
  }[];

  [key: string]: any | IFieldQuery<any>;
}

export interface RefreshTokenPayload {
  jti: number;
  sub: number;
}

export type Role = 'admin' | 'client' | 'employee';

export type Gender = 'male' | 'female' | 'other';
export type Owner = 'user' | 'client';

export type Status = 'wait' | 'success' | 'fail';

export type StatusPurchase = 'Pending' | 'Completed' | 'Failed' | 'Refunded';
