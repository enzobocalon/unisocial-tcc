import { forwardRef, MutableRefObject } from 'react';
import { BottomSheet } from '../../BottomSheet';
import * as S from './styles';
import { Avatar } from '../../Avatar';
import { Text } from '../../Text';
import { BottomSheetFlatList, BottomSheetModal } from '@gorhom/bottom-sheet';
import { useLikes } from './useLikes';
import { View } from 'react-native';

interface Props {
  count: number;
  postId: string;
}

export const Likes = forwardRef<BottomSheetModal, Props>(
  ({ count, postId }, ref) => {
    const modalRef = ref as MutableRefObject<BottomSheetModal | null>;
    const {
      data,
      setIsOpen,
      loading,
      hasMoreData,
      setPage,
      initialQueryCompleted,
      navigation,
      dataCount,
    } = useLikes(postId);
    return (
      <BottomSheet
        ref={modalRef}
        useScrollableComponent
        snapPoints={['50%', '100%']}
        onAnimate={() => {
          setIsOpen(true);
        }}
        onDismiss={() => {
          setIsOpen(false);
          setPage(0);
        }}
        loading={loading}
      >
        <BottomSheetFlatList
          data={data}
          renderItem={({ item }) => (
            <S.UserContainer
              activeOpacity={0.8}
              onPress={() => {
                modalRef?.current?.dismiss();
                navigation.navigate('UserProfile', { userId: item.id });
              }}
            >
              <Avatar size={32} />
              <Text weight="Semibold">{item.name}</Text>
            </S.UserContainer>
          )}
          ListHeaderComponent={() => (
            <S.HeaderContainer>
              <Text size={20} weight="Bold">
                Curtidas
              </Text>

              <Text size={14} style={{ letterSpacing: 0.1 }}>
                · <Text weight="Semibold">{dataCount || count}</Text> curtidas
              </Text>
            </S.HeaderContainer>
          )}
          onEndReached={() => {
            if (hasMoreData && initialQueryCompleted) {
              setPage((prev) => prev + 1);
            }
          }}
          onEndReachedThreshold={0.1}
          ListEmptyComponent={() => (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 8,
              }}
            >
              <Text weight="Semibold" size={16} align="center">
                Nenhuma curtida encontrada.
              </Text>
            </View>
          )}
        />
      </BottomSheet>
    );
  }
);

Likes.displayName = 'Likes';
