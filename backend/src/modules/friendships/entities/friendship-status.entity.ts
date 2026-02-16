import { registerEnumType } from '@nestjs/graphql';

export enum FriendshipStatusEnum {
  NONE = 'NONE',
  SENT = 'SENT',
  RECEIVED = 'RECEIVED',
  ACCEPTED = 'ACCEPTED',
  BLOCKED = 'BLOCKED',
}

registerEnumType(FriendshipStatusEnum, {
  name: 'FriendshipStatusEnum',
});
