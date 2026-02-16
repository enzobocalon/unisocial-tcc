import { UserPlus } from '../Icons/UserPlus';
import { Users } from '../Icons/Users';
import { Text } from '../Text';
import * as S from './styles';
import { BaseUser, FriendshipStatusEnum } from '../../__generated__/graphql';
import { ClockUser } from '../Icons/ClockUser';
import { useFriendshipButton } from './useFriendshipButton';
import { Loading } from '../Loading';
import { View } from 'react-native';

interface FriendshipButtonProps {
  user: BaseUser;
}

export function FriendshipButton({ user }: FriendshipButtonProps) {
  const {
    theme,
    handleFriendship,
    isLoading,
    handleReceivedFriendship,
    isPending,
  } = useFriendshipButton(user);
  if (user.friendship?.status === FriendshipStatusEnum.Received) {
    return (
      <S.Container>
        {isLoading ? (
          <S.Button disabled isFriend={true}>
            <Loading color={theme.colors.blue} />
            <Text color={theme.colors.blue}>Carregando...</Text>
          </S.Button>
        ) : (
          <>
            <S.Button
              isFriend={true}
              activeOpacity={0.7}
              onPress={() => handleReceivedFriendship(false)}
              disabled={isLoading || isPending}
            >
              <Text weight="Semibold">Recusar</Text>
            </S.Button>
            <S.Button
              isFriend={false}
              activeOpacity={0.7}
              onPress={() => handleReceivedFriendship(true)}
              disabled={isLoading || isPending}
            >
              <Text color="white" weight="Semibold">
                Aceitar
              </Text>
            </S.Button>
          </>
        )}
      </S.Container>
    );
  }
  return (
    <S.Button
      activeOpacity={0.7}
      isFriend={
        user.friendship?.status === FriendshipStatusEnum.Accepted ||
        user.friendship?.status === FriendshipStatusEnum.Sent ||
        isLoading // force 'white'
      }
      onPress={isLoading || isPending ? () => null : handleFriendship}
      disabled={isLoading || isPending}
    >
      {isLoading || isPending ? (
        <S.Wrapper>
          <Loading color={theme.colors.blue} size={18} />
        </S.Wrapper>
      ) : (
        <>
          {user.friendship?.status === FriendshipStatusEnum.Accepted ? (
            <Users color={theme.colors.blue} size={18} />
          ) : user.friendship?.status === FriendshipStatusEnum.Sent ? (
            <ClockUser color={theme.colors.blue} size={18} />
          ) : (
            <UserPlus color="#fff" size={18} />
          )}
          <Text
            weight="Semibold"
            color={
              user.friendship?.status !== FriendshipStatusEnum.Accepted &&
                user.friendship?.status !== FriendshipStatusEnum.Sent
                ? 'white'
                : theme.colors.blue
            }
          >
            {user.friendship?.status === FriendshipStatusEnum.Accepted
              ? 'Amigos'
              : user.friendship?.status === FriendshipStatusEnum.Sent
                ? 'Solicitado'
                : 'Solicitar'}
          </Text>
        </>
      )}
    </S.Button>
  );
}
