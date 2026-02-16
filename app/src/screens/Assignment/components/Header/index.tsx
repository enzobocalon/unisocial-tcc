import { useNavigation } from '@react-navigation/native';
import * as S from './styles';
import { StackProps } from '../../../../types/Navigation';
import { Avatar } from '../../../../components/Avatar';
import { Assignment } from '../../../../__generated__/graphql';
import { Text } from '../../../../components/Text';

type Props = {
  data: Assignment;
};

export function AssignmentHeader({ data }: Props) {
  const navigation = useNavigation<StackProps>();
  return (
    <S.Container
      activeOpacity={0.7}
      onPress={() => {
        navigation.navigate('AssignmentDetails', { assignmentId: data.id });
      }}
    >
      <Avatar source={data.icon || null} size={40} useGroupPlaceholder />
      <Text size={18} weight="Semibold">
        {data.name}
      </Text>
    </S.Container>
  );
}
