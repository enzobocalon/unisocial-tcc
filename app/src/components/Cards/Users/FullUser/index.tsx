import { Image } from 'react-native';
import * as S from './styles';
import { Avatar } from '../../../Avatar';
import { Text } from '../../../Text';
import { useTheme } from 'styled-components';
import { BaseUser } from '../../../../__generated__/graphql';
import { FriendshipButton } from '../../../FriendshipButton';

const image = {
  uri: 'https://picsum.photos/seed/696/3000/2000',
};

interface FullUserCardProps {
  user: BaseUser;
}

export function FullUserCard({ user }: FullUserCardProps) {
  const theme = useTheme();
  return (
    <S.Container>
      <S.BannerContainer>
        <Image
          source={image}
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      </S.BannerContainer>
      <S.ImageContainer>
        <Avatar size={60} source={user.avatar} />
      </S.ImageContainer>
      <S.UserInfoContainer>
        <S.ActionContainer>
          <FriendshipButton user={user} />
        </S.ActionContainer>

        <S.UserInfoWrapper>
          <Text weight="Bold">{user.name}</Text>
          <Text color={theme.colors.lightGray}>@{user.username}</Text>
          <Text style={{ marginTop: 18 }} numberOfLines={2}>
            {user.bio}
          </Text>
        </S.UserInfoWrapper>
      </S.UserInfoContainer>
    </S.Container>
  );
}
