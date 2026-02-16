import * as S from './styles';
import { Text } from '../../Text';
import { forwardRef, useCallback } from 'react';
import { Reply } from '../../Reply';
import { Dimensions, TouchableOpacity } from 'react-native';
import { AnimatedHeart } from '../../AnimatedHeart';
import {
  BottomSheetFlatList,
  BottomSheetFooter,
  BottomSheetFooterProps,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { BottomSheet } from '../../BottomSheet';
import { ReplyRef } from '../../../types/Refs';
import { useReplies } from './useReplies';
import { Post } from '../../../__generated__/graphql';
import React from 'react';
import { Loading } from '../../Loading';
import { ReplyInput } from './components/Input';

interface RepliesProps {
  liked: boolean;
  post: Post;
  onPressLike?: () => void;
  setReplies: React.Dispatch<React.SetStateAction<number>>;
}

export const Replies = forwardRef<ReplyRef, RepliesProps>(
  ({ liked, onPressLike, post, setReplies }, ref) => {
    const {
      user,
      bottomRef,
      inputRef,
      data,
      loading,
      theme,
      handleReplySelection,
      parent,
      setParent,
      control,
      renderSuggestions,
      selectedImages,
      handleGallery,
      onSourceChange,
      handleSubmit,
      handleEdit,
      editing,
      fetchNextPage,
      hasNextPage,
      isPending,
    } = useReplies(ref, post, setReplies, 'timeline');
    const renderFooter = useCallback(
      (props: BottomSheetFooterProps) => (
        <BottomSheetFooter
          {...props}
          bottomInset={0}
          style={{
            backgroundColor: 'white',
          }}
        >
          <ReplyInput
            editing={editing}
            handleEdit={handleEdit}
            handleGallery={handleGallery}
            onSourceChange={onSourceChange}
            selectedImages={selectedImages}
            control={control}
            ref={inputRef}
            parent={parent}
            handleSubmit={handleSubmit}
            setParent={setParent}
            renderSuggestions={renderSuggestions}
            isPending={isPending}
          />
        </BottomSheetFooter>
      ),
      [user, parent, selectedImages, editing, renderSuggestions, handleEdit]
    );

    return (
      <BottomSheet
        ref={bottomRef}
        snapPoints={loading || data.length === 0 ? ['50%'] : ['50%', '100%']}
        footerComponent={renderFooter}
        useScrollableComponent
        enableDynamicSizing={false}
        keyboardBehavior="interactive"
      >
        <S.ContainerHeader>
          <S.HeaderWrapper>
            <Text weight="Bold" size={20}>
              Comentários
            </Text>
          </S.HeaderWrapper>
          <S.HeaderWrapper style={{ justifyContent: 'flex-end' }}>
            <TouchableOpacity
              touchSoundDisabled
              activeOpacity={1}
              onPress={onPressLike}
            >
              <AnimatedHeart liked={liked} size={20} />
            </TouchableOpacity>
          </S.HeaderWrapper>
        </S.ContainerHeader>
        {loading ? (
          <BottomSheetView>
            <Loading color={theme.colors.blue} size={'large'} />
          </BottomSheetView>
        ) : (
          <BottomSheetFlatList
            data={data}
            renderItem={({ item }) => (
              <Reply
                isParent
                hasChildrenReply={item!.replies > 0}
                reply={item!}
                onReplySelection={handleReplySelection}
                onEdit={handleEdit}
                setReplies={setReplies}
                sheetClose={() => bottomRef.current?.dismiss()}
              />
            )}
            keyExtractor={(item) => item!.id}
            contentContainerStyle={{
              minHeight: Dimensions.get('window').height / 2,
              paddingBottom: 80,
            }}
            ListEmptyComponent={() => (
              <S.EmptyContainer>
                <Text weight="Semibold" numberOfLines={1}>
                  Nenhuma resposta encontrada.
                </Text>
              </S.EmptyContainer>
            )}
            onEndReached={() => {
              if (hasNextPage) {
                fetchNextPage();
              }
            }}
            onEndReachedThreshold={0.1}
            nestedScrollEnabled
            CellRendererComponent={({ children }) => children}
            removeClippedSubviews={false}
          />
        )}
      </BottomSheet>
    );
  }
);

Replies.displayName = 'Replies';
