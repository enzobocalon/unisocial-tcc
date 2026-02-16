import { View } from 'react-native';
import {
  AssignmentsUsers,
  ChatMember,
} from '../../../../__generated__/graphql';
import { Avatar } from '../../../../components/Avatar';
import { Text } from '../../../../components/Text';
import * as S from './styles';
import { useTheme } from 'styled-components';

interface Props {
  data: ChatMember | AssignmentsUsers;
  onPress: () => void;
}

export function MemberCard({ data, onPress }: Props) {
  const theme = useTheme();
  return (
    <S.Container onPress={onPress} activeOpacity={0.7}>
      <S.ItemContainer>
        <Avatar source={data.user.avatar} size={36} />
        <View>
          <Text size={18}>{data.user.name}</Text>
          <Text size={14}>@{data.user.username}</Text>
        </View>
      </S.ItemContainer>
      {data.isAdmin && (
        <S.AdminContainer>
          <Text size={12} color={theme.colors.blue} weight="Semibold">
            Admin
          </Text>
        </S.AdminContainer>
      )}
    </S.Container>
  );
}
