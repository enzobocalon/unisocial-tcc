import { Image } from 'react-native';
import { Source, SourceWithId } from '../../../../types/Sources';
import * as S from './styles';
import { FlatList } from 'react-native';
import { Cross } from '../../../../components/Icons/Cross';
import { useChatFooter } from './useChatFooter';
interface Props {
  medias: SourceWithId[];
  onDelete: (source: Source) => void;
}

export function ChatFooter({ onDelete, medias = [] }: Props) {
  const { handleScrollEnable, scrollEnabled } = useChatFooter();

  if (medias.length === 0) {
    return;
  }

  return (
    <S.Container>
      <FlatList
        data={medias}
        horizontal
        keyExtractor={(item) => item.id}
        scrollEnabled={scrollEnabled}
        onContentSizeChange={handleScrollEnable}
        renderItem={({ item }) => (
          <S.ImageContainer>
            <Image
              source={{ uri: item.uri }}
              width={100}
              height={100}
              style={{ borderRadius: 8 }}
            />
            <S.DeleteButton onPress={() => onDelete(item)} hitSlop={12}>
              <Cross color="white" />
            </S.DeleteButton>
          </S.ImageContainer>
        )}
      />
    </S.Container>
  );
}
