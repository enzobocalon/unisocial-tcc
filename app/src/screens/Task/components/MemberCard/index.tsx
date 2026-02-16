import { View } from 'react-native';
import { TaskMember } from '../../../../__generated__/graphql';
import { Avatar } from '../../../../components/Avatar';
import { Text } from '../../../../components/Text';
import * as S from './styles';
import { useTheme } from 'styled-components';
import { Check } from '../../../../components/Icons/Check';

interface Props {
  data: TaskMember;
  onPress: () => void;
}

export function TaskMemberCard({ data, onPress }: Props) {
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
      {data.completed && (
        <S.IconContainer>
          <Check color={theme.colors.success.primary} size={14} />
        </S.IconContainer>
      )}
    </S.Container>
  );
}
