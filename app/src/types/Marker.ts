import { BaseUser } from './User';

export interface Marker extends BaseUser {
  location: [number, number];
}
