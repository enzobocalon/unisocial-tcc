import { useNavigation } from '@react-navigation/native';
import { Chat } from '../../../../__generated__/graphql';
import { Avatar } from '../../../../components/Avatar';
import { Text } from '../../../../components/Text';
import * as S from './styles';
import { StackProps } from '../../../../types/Navigation';

interface Props {
  data: Chat;
}

export function ChatHeader({ data }: Props) {
  const navigation = useNavigation<StackProps>();
  return (
    <S.Container
      activeOpacity={0.7}
      onPress={() => navigation.navigate('ChatDetails', { chatId: data.id })}
    >
      <Avatar
        source={data.icon || null}
        size={40}
        online={!data.isDirect ? false : !!data.isOnline}
        useGroupPlaceholder={!data.isDirect}
      />
      <Text size={18} weight="Semibold">
        {data.name}
      </Text>
    </S.Container>
  );
}
