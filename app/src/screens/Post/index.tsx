import { FlatList } from 'react-native';
import { StackParams } from '../../types/Navigation';
import { StackScreenProps } from '@react-navigation/stack';
import { usePostScreen } from './usePostScreen';
import ScreenHeader from '../../components/ScreenHeader';
import { Post } from '../../components/Post';
import { Post as IPost } from '../../__generated__/graphql';
import { Reply } from '../../components/Reply';
import { ReplyInput } from '../../components/Post/Replies/components/Input';
import { memo } from 'react';
import * as S from './styles';
import { useTheme } from 'styled-components';
import { Text } from '../../components/Text';
import { FloatingLoading } from '../../components/FloatingLoading';
import { Loading } from '../../components/Loading';

const MemoPost = memo(Post);
const MemoReply = memo(Reply);

type PostScreenProps = StackScreenProps<StackParams, 'PostScreen'>;

export function PostScreen({ route }: PostScreenProps) {
  const { postId } = route.params;
  const {
    post,
    replies,
    setRepliesCount,
    repliesCount,
    handleEdit,
    control,
    editing,
    handleSubmit,
    inputRef,
    isLoadingPost,
    isLoadingReplies,
    onSourceChange,
    renderSuggestions,
    setParent,
    handleGallery,
    handleReplySelection,
    parent,
    selectedImages,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoadingRepliesHook,
    isPending,
  } = usePostScreen(postId);
  const theme = useTheme();

  return (
    <S.Container>
      <ScreenHeader renderBackButton />

      {isLoadingPost ||
      isLoadingReplies ||
      isLoadingRepliesHook ||
      !replies ||
      !post ? (
        <S.CenteredContainer>
          <Loading size={64} color={theme.colors.blue} />
        </S.CenteredContainer>
      ) : (
        <FlatList
          data={replies}
          keyExtractor={(item) => item!.id}
          ListHeaderComponent={() => (
            <>
              <MemoPost
                post={post as IPost}
                overrideReplies={repliesCount}
                overrideSetReplies={setRepliesCount}
              />
              <ReplyInput
                control={control}
                editing={editing}
                handleEdit={handleEdit}
                handleGallery={handleGallery}
                handleSubmit={handleSubmit}
                onSourceChange={onSourceChange}
                parent={parent}
                setParent={setParent}
                renderSuggestions={renderSuggestions}
                selectedImages={selectedImages}
                ref={inputRef}
                borderColor="white"
                isPending={isPending}
              />
            </>
          )}
          renderItem={({ item }) => (
            <MemoReply
              reply={item!}
              setReplies={setRepliesCount}
              onEdit={handleEdit}
              onReplySelection={handleReplySelection}
              hasChildrenReply={item!.replies > 0}
              isParent
            />
          )}
          contentContainerStyle={{
            paddingBottom: 16,
            backgroundColor: 'white',
            flexGrow: 1,
          }}
          ListEmptyComponent={() => (
            <S.CenteredContainer>
              <Text weight="Semibold" numberOfLines={1}>
                Nenhuma resposta encontrada.
              </Text>
            </S.CenteredContainer>
          )}
          onEndReached={() => {
            if (hasNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.4}
        />
      )}
      <FloatingLoading isLoading={isFetchingNextPage} />
    </S.Container>
  );
}
