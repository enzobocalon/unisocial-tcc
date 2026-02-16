import { Avatar } from '../../../Avatar';
import { Text } from '../../../Text';
import * as S from './styles';
import { TouchableOpacity, View } from 'react-native';
import { Cross } from '../../../Icons/Cross';
import { Check } from '../../../Icons/Check';
import {
  Notification,
  NotificationStatus,
} from '../../../../__generated__/graphql';
import { useFriendRequestNotification } from './useFriendRequest';
import { Loading } from '../../../Loading';

interface FriendRequestProps {
  notification: Notification;
}

export function FriendRequestNotification({
  notification,
}: FriendRequestProps) {
  const {
    theme,
    accept,
    deny,
    navigation,
    isPendingAcceptFriendship,
    isPendingDeleteFriendship,
  } = useFriendRequestNotification(notification);
  return (
    <S.Container
      activeOpacity={0.8}
      isUnread={notification.status === NotificationStatus.Unread}
      onPress={() => {
        navigation.navigate('UserProfile', {
          userId: notification.emitters[0].id,
        });
      }}
    >
      <Avatar size={48} source={notification.emitters[0].avatar} />

      <S.Wrapper>
        <S.InfoContainer>
          <Text>
            <Text weight="Semibold">{notification.emitters[0].name}</Text>
          </Text>
          <Text color={theme.colors.lightGray} size={15}>
            enviou uma solicitação de amizade
          </Text>
        </S.InfoContainer>
        <S.ActionsContainer>
          <TouchableOpacity
            style={{ padding: 8 }}
            activeOpacity={0.8}
            onPress={deny}
            hitSlop={8}
            disabled={isPendingDeleteFriendship}
          >
            {isPendingDeleteFriendship ? (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 16,
                  height: 16,
                }}
              >
                <Loading color={theme.colors.blue} />
              </View>
            ) : (
              <Cross />
            )}
          </TouchableOpacity>
          <S.Button
            activeOpacity={0.8}
            onPress={accept}
            hitSlop={8}
            disabled={isPendingAcceptFriendship}
          >
            {isPendingAcceptFriendship ? (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 16,
                  height: 16,
                }}
              >
                <Loading color="white" />
              </View>
            ) : (
              <Check color="white" />
            )}
          </S.Button>
        </S.ActionsContainer>
      </S.Wrapper>
    </S.Container>
  );
}
