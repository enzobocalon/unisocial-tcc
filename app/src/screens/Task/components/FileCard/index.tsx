import { TaskFiles } from '../../../../__generated__/graphql';
import { File } from '../../../../components/Icons/File';
import { Text } from '../../../../components/Text';
import * as S from './styles';

interface Props {
  item: TaskFiles;
  onPress: () => void;
}

export function FileCard({ item, onPress }: Props) {
  return (
    <S.Container onPress={() => onPress()}>
      <File size={24} />
      <Text
        style={{
          marginTop: 8,
        }}
        weight="Semibold"
        size={12}
        numberOfLines={1}
      >
        {item.filename}
      </Text>
    </S.Container>
  );
}
