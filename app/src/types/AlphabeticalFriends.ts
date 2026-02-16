import {
  BaseUser,
  GetAllFriendsAlphabeticallyQuery,
} from '../__generated__/graphql';

export type AlphabeticalFriends = GetAllFriendsAlphabeticallyQuery;

export type AlphabeticalFriendsData = [string, BaseUser[]][];
