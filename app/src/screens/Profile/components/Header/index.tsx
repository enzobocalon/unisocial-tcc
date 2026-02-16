import { Dimensions, Image, StyleSheet, View } from 'react-native';
import * as S from './styles';
import { Avatar } from '../../../../components/Avatar';
import { FriendshipButton } from '../../../../components/FriendshipButton';
import { BaseUser } from '../../../../__generated__/graphql';
import { Text } from '../../../../components/Text';
import { useTheme } from 'styled-components';
import { useAuth } from '../../../../context/AuthContext';
import { Edit } from '../../../../components/Icons/Edit';
import { useNavigation } from '@react-navigation/native';
import { StackProps } from '../../../../types/Navigation';
import { LeftArrow } from '../../../../components/Icons/LeftArrow';
import { createPath } from '../../../../utils/path';
import { useState } from 'react';
import { Skeleton } from '../../../../components/Skeleton';

interface HeaderProps {
  user: BaseUser;
  onLayout?: (height: number) => void;
}

export function Header({ user, onLayout }: HeaderProps) {
  const theme = useTheme();
  const { user: loggedUser } = useAuth();
  const navigation = useNavigation<StackProps>();
  const banner = user.banner ? user.banner : null;
  const [isLoadingBanner, setIsLoadingBanner] = useState(true);

  return (
    <S.Container
      onLayout={(event) => {
        onLayout?.(event.nativeEvent.layout.height);
      }}
    >
      <S.BackContainer activeOpacity={0.7} onPress={() => navigation.goBack()}>
        <LeftArrow color="white" />
      </S.BackContainer>

      <View>
        {isLoadingBanner && (
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              zIndex: 10000,
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            <Skeleton />
          </View>
        )}
        <Image
          source={{
            uri: banner
              ? createPath(banner)
              : 'https://picsum.photos/seed/696/3000/2000',
          }}
          style={{
            width: Dimensions.get('window').width,
            height: 100,
            objectFit: 'cover',
          }}
          onLoadEnd={() => setIsLoadingBanner(false)}
        />
      </View>
      <S.InfoRow>
        <S.AvatarContainer>
          <Avatar source={user.avatar} size={64} borderRadius={64} />
        </S.AvatarContainer>
        {loggedUser?.me.id !== user.id ? (
          <FriendshipButton user={user} />
        ) : (
          <S.Button
            activeOpacity={0.8}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Edit color={theme.colors.blue} size={18} />
            <Text weight="Semibold" color={theme.colors.blue}>
              Editar Perfil
            </Text>
          </S.Button>
        )}
      </S.InfoRow>
      <S.Wrapper>
        <Text weight="Bold">{user.name}</Text>
        <Text color={theme.colors.lightGray}>@{user.username}</Text>
        {user.bio && (
          <Text style={{ marginTop: 18 }} numberOfLines={2}>
            {user.bio}
          </Text>
        )}
        <S.Row>
          <Text size={15}>
            <Text weight="Semibold" size={15}>
              {user.friendsCount}
            </Text>{' '}
            Amigos
          </Text>
          <Text>·</Text>
          <Text size={15}>{user.course?.name}</Text>
        </S.Row>
      </S.Wrapper>
    </S.Container>
  );
}
