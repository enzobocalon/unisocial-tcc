import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { Text } from '../Text';
import * as S from './styles';
import { Avatar } from '../Avatar';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from 'styled-components';
import { User } from '../Icons/User';
import { Pin } from '../Icons/Pin';
import { Gear } from '../Icons/Gear';
import { Exit } from '../Icons/Exit';
import { Chat } from '../Icons/Chat';
import { useNavigation } from '@react-navigation/native';
import { BottomTabProps, StackProps } from '../../types/Navigation';

export function Drawer(props: DrawerContentComponentProps) {
  const { user, signout } = useAuth();
  const navigation = useNavigation<StackProps & BottomTabProps>();
  const theme = useTheme();
  return (
    <S.Container>
      <S.Wrapper>
        <Avatar size={48} source={user?.me.avatar} />
        <S.Info>
          <Text weight="Semibold">{user?.me.name}</Text>
          <Text color={theme.colors.lightGray}>@{user?.me.username}</Text>
        </S.Info>

        <S.Separator />
        <S.Info>
          <S.Item
            activeOpacity={0.7}
            onPress={() =>
              navigation.navigate('Profile', {
                userId: user?.me.id as string,
              })
            }
          >
            <User size={20} />
            <Text size={20}>Perfil</Text>
          </S.Item>
          <S.Item
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Tracking')}
          >
            <Pin size={20} />
            <Text size={20}>Localização</Text>
          </S.Item>
          <S.Item
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Communications')}
          >
            <Chat size={20} />
            <Text size={20}>Mensagens</Text>
          </S.Item>
          {/* <S.Item activeOpacity={0.7}>
            <Gear size={20} />
            <Text size={20}>Configurações</Text>
          </S.Item> */}
        </S.Info>
      </S.Wrapper>
      <S.Item activeOpacity={0.7} onPress={signout}>
        <Exit size={20} />
        <Text size={20}>Sair</Text>
      </S.Item>
    </S.Container>
  );
}
