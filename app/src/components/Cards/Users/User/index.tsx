import { View } from 'react-native';
import { Avatar } from '../../../Avatar';
import { Text } from '../../../Text';
import * as S from './styles';
import { useTheme } from 'styled-components';
import { Users } from '../../../Icons/Users';
import {
  BaseUser,
  FriendshipStatusEnum,
} from '../../../../__generated__/graphql';
import { FriendshipButton } from '../../../FriendshipButton';

interface Params {
  horizontal?: boolean;
  user: BaseUser;
  renderFollowButton?: boolean;
}

export function UserCard({ horizontal, user, renderFollowButton }: Params) {
  const theme = useTheme();
  if (!user) {
    return;
  }
  return (
    <S.Container>
      <S.Wrapper isHorizontal={horizontal}>
        <Avatar size={32} source={user.avatar} />
        <View
          style={{
            marginTop: horizontal ? 0 : 8,
            marginLeft: horizontal ? 4 : 0,
            alignItems: horizontal ? 'flex-start' : 'center',
            justifyContent: 'center',
            gap: 4,
          }}
        >
          <Text size={15} numberOfLines={1} weight="Bold">
            {user.name}
          </Text>
          <Text size={14} numberOfLines={1} color={theme.colors.lightGray}>
            @{user.username}
          </Text>
          {user.friendship?.status === FriendshipStatusEnum.Accepted && (
            <View
              style={{
                flexDirection: 'row',
                gap: 8,
                alignItems: 'center',
                justifyContent: horizontal ? 'flex-start' : 'center',
              }}
            >
              <Users size={13} color={theme.colors.lightGray} />
              <Text size={13} color={theme.colors.lightGray}>
                Amigos
              </Text>
            </View>
          )}
        </View>
      </S.Wrapper>
      {renderFollowButton && <FriendshipButton user={user} />}
    </S.Container>
  );
}
