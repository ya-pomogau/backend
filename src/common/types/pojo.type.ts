/* eslint-disable camelcase */
import { Document, Require_id } from 'mongoose';

// eslint-disable-next-line no-use-before-define
export type POJOType<T extends Document> = ReturnType<T['toObject']> extends Require_id<T>
  ? { [K in keyof T]: T[K] extends (infer U)[] ? U : T[K] }
  : never;
