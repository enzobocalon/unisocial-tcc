import { forwardRef } from 'react';
import { Avatar } from '../../Avatar';
import * as S from './styles';
import { BottomSheet } from '../../BottomSheet';
import { BottomSheetFlatList, BottomSheetModal } from '@gorhom/bottom-sheet';
import { Text } from '../../Text';
import { Post } from '../../../__generated__/graphql';
import { useShareList } from './useShareList';
import { View } from 'react-native';

interface ShareListProps {
  post: Post;
}

export const ShareList = forwardRef<BottomSheetModal, ShareListProps>(
  ({ post }, ref) => {
    const { data, count, hasMoreData, initialQueryCompleted, setPage } =
      useShareList(post.id);
    return (
      <BottomSheet
        ref={ref}
        useScrollableComponent
        snapPoints={['50%', '100%']}
      >
        <BottomSheetFlatList
          data={data}
          keyExtractor={({ id }) => id}
          renderItem={({ item }) => (
            <S.UserContainer activeOpacity={0.8}>
              <Avatar size={32} source={item.user.avatar} />
              <Text weight="Semibold">{item.user.name}</Text>
            </S.UserContainer>
          )}
          ListHeaderComponent={() => (
            <S.HeaderContainer>
              <Text size={20} weight="Bold">
                Compartilhamentos
              </Text>

              <Text size={14} style={{ letterSpacing: 0.1 }}>
                · <Text weight="Semibold">{count || post.shares}</Text>{' '}
                compartilhamentos
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
                Nenhum compartilhamento encontrado.
              </Text>
            </View>
          )}
        />
      </BottomSheet>
    );
  }
);

ShareList.displayName = 'ShareList';
