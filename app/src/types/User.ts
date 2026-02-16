import { MeQuery } from '../__generated__/graphql';

export type BaseUser = {
  avatar: string;
  id: string;
  name: string;
  username: string;
  isFriend?: boolean;
};

export type User = MeQuery | BaseUser;
