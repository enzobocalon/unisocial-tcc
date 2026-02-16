import { forwardRef } from 'react';
import { Text } from '../Text';
import * as S from './styles';
import { BottomSheet } from '../BottomSheet';
import { BottomSheetFlatList, BottomSheetModal } from '@gorhom/bottom-sheet';
import { Avatar } from '../Avatar';
import { useMentionPopup } from './useMentionPopup';
import { Search } from '../Icons/Search';
import { Suggestion } from 'react-native-controlled-mentions';
import { View } from 'react-native';

interface MentionPopupProps {
  mentionText: string;
  onMention: (suggestion: Suggestion) => void;
  onMentionClose?: () => void;
}

export const MentionPopup = forwardRef<BottomSheetModal, MentionPopupProps>(
  ({ mentionText, onMention }, ref) => {
    const { data, loading } = useMentionPopup(mentionText);
    return (
      <BottomSheet
        ref={ref}
        snapPoints={['50%', '75%']}
        useBackdrop={true}
        useScrollableComponent
        loading={loading}
      >
        <BottomSheetFlatList
          data={data}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            gap: 8,
            paddingVertical: 16,
            paddingHorizontal: 8,
          }}
          renderItem={({ item }) =>
            item.id !== 'INFO' ? (
              <S.Container>
                <S.Button
                  onPress={() =>
                    onMention({ id: item.id, name: item.username })
                  }
                >
                  <Avatar size={28} />
                  <Text numberOfLines={1}>{item.name}</Text>
                </S.Button>
              </S.Container>
            ) : (
              <S.Container>
                <S.InfoContainer>
                  <S.IconContainer>
                    <Search color="white" size={20} />
                  </S.IconContainer>
                  <S.InfoContainerText>
                    <Text weight="Semibold">Procurar por um usuário</Text>
                    <Text size={14}>
                      Continue digitando para encontrar o usuário...
                    </Text>
                  </S.InfoContainerText>
                </S.InfoContainer>
              </S.Container>
            )
          }
          ListHeaderComponent={() => (
            <View
              style={{
                paddingHorizontal: 8,
                marginBottom: 8,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Text size={18} weight="Semibold">
                Buscando: {mentionText}
              </Text>
            </View>
          )}
        />
      </BottomSheet>
    );
  }
);

MentionPopup.displayName = 'MentionPopup';
