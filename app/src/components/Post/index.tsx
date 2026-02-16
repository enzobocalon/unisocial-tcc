import { TouchableOpacity } from 'react-native';
import { DotsVertical } from '../Icons/DotsVertical';
import { Text } from '../Text';
import * as S from './styles';
import { Heart } from '../Icons/Heart';
import { PostActions } from './PostActions';
import { UserAction } from './UserAction';
import { Author } from './Author';
import { ParentPost } from './Parent';
import { textSlicer } from '../../utils/textSlicer';
import { MediaGrid } from '../Medias/MediaGrid';
import { usePost } from './usePost';
import { Post as IPost } from '../../__generated__/graphql';
import { PostOptions } from './Parent/Options';

interface PostProps {
  post: IPost;
  parent?: IPost['parent'];
  postKey?: string | null;
  shouldOpenReplyBottomSheet?: boolean;
  overrideReplies?: number;
  overrideSetReplies?: React.Dispatch<React.SetStateAction<number>>;
  shouldRenderUserActions?: boolean;
  shouldReplyNavigateToPostPage?: boolean;
}

export function Post({
  post,
  postKey,
  shouldOpenReplyBottomSheet,
  parent = post.parent,
  overrideReplies,
  overrideSetReplies: setOv,
  shouldRenderUserActions = true,
  shouldReplyNavigateToPostPage = false,
}: PostProps) {
  const {
    bottomSheetRef,
    hasUserAction,
    navigation,
    optionsRef,
    likes,
    setLikes,
    setShares,
    shares,
    replies,
    setReplies,
    replaceMetaTag,
    content,
  } = usePost(post);

  return (
    <S.Container
      activeOpacity={1}
      touchSoundDisabled
      onPress={() => navigation.navigate('PostScreen', { postId: post.id })}
    >
      {hasUserAction && shouldRenderUserActions && (
        <UserAction actions={post.actions!} />
      )}
      <S.AuthorContainer hasUserAction={hasUserAction as boolean}>
        <Author user={post.user} timestamp={post.createdAt} />
        <TouchableOpacity
          onPress={() => optionsRef.current?.present()}
          activeOpacity={0.5}
          hitSlop={8}
        >
          <DotsVertical />
          <PostOptions ref={optionsRef} post={post} />
        </TouchableOpacity>
      </S.AuthorContainer>

      <S.Body>
        <TouchableOpacity
          style={{
            justifyContent: 'center',
            flex: 1,
          }}
        >
          {post.content && (
            <Text
              style={{
                marginBottom: 8,
              }}
            >
              {replaceMetaTag(textSlicer(content), (userId: string) => {
                navigation.navigate('UserProfile', { userId });
              })}
            </Text>
          )}
        </TouchableOpacity>
        {post.media && <MediaGrid sources={post.media} />}
        {(post.parent || post.parentId) && (
          <ParentPost post={parent!} isDeleted={post.parentId === 'DELETED'} />
        )}
      </S.Body>

      <S.PostStats>
        <S.PostStatsItem
          activeOpacity={0.7}
          onPress={() => bottomSheetRef.current?.openLikes()}
        >
          <Heart />
          <Text size={14}>{likes}</Text>
        </S.PostStatsItem>

        <S.PostStatsWrapper>
          <S.PostStatsItem
            activeOpacity={0.7}
            onPress={() => {
              if (shouldReplyNavigateToPostPage) {
                navigation.navigate('PostScreen', { postId: post.id });
              } else {
                bottomSheetRef.current?.openReply();
              }
            }}
          >
            <Text size={14}>
              {overrideReplies ? overrideReplies : replies} comentários
            </Text>
          </S.PostStatsItem>

          <Text>·</Text>

          <S.PostStatsItem
            activeOpacity={0.7}
            onPress={() => bottomSheetRef.current?.openSharesList()}
          >
            <Text size={14}>{shares} compartilhamentos</Text>
          </S.PostStatsItem>
        </S.PostStatsWrapper>
      </S.PostStats>

      <PostActions
        ref={bottomSheetRef}
        post={post}
        setters={{ setLikes, setShares, setReplies: setOv || setReplies }}
        likes={likes}
        postKey={postKey}
        shouldOpenReplyBottomSheet={shouldOpenReplyBottomSheet}
        shouldReplyNavigateToPostPage={shouldReplyNavigateToPostPage}
      />
    </S.Container>
  );
}
