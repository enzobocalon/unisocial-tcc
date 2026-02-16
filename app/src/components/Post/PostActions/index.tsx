import * as S from './styles';
import { Reply } from '../../Icons/Reply';
import { Share } from '../../Icons/Share';
import { Text } from '../../Text';
import { forwardRef } from 'react';
import { BottomSheetButton } from '../../BottomSheet/BottomSheetButton';
import { Edit } from '../../Icons/Edit';
import { Replies } from '../Replies';
import { AnimatedHeart } from '../../AnimatedHeart';
import { BottomSheet } from '../../BottomSheet';
import { PostActionsRef } from '../../../types/Refs';
import { Likes } from '../Likes';
import { ShareList } from '../ShareList';
import { usePostActions } from './usePostActions';
import { Post } from '../../../__generated__/graphql';
import { Loading } from '../../Loading';
import { View } from 'react-native';

interface Setters {
  setLikes: React.Dispatch<React.SetStateAction<number>>;
  setShares: React.Dispatch<React.SetStateAction<number>>;
  setReplies: React.Dispatch<React.SetStateAction<number>>;
}

interface PostActionsProps {
  post: Post;
  setters: Setters;
  likes: number;
  postKey?: string | null;
  shouldOpenReplyBottomSheet?: boolean;
  shouldReplyNavigateToPostPage?: boolean;
}

export const PostActions = forwardRef<PostActionsRef, PostActionsProps>(
  (
    {
      post,
      setters,
      likes,
      postKey,
      shouldOpenReplyBottomSheet,
      shouldReplyNavigateToPostPage = false,
    },
    ref
  ) => {
    const { setLikes, setReplies, setShares } = setters;
    const {
      bottomShareRef,
      handleOnPressLike,
      liked,
      likeBottomSheetRef,
      replyRef,
      sharesListBottomRef,
      shared,
      navigation,
      handleShare,
      isPendingLike,
      isPendingUnlike,
      isPendingShare,
      isPendingUnshare,
      theme,
    } = usePostActions(ref, post, { setLikes, setShares, setReplies }, postKey);

    return (
      <S.ActionsContainer>
        <S.ActionItem
          hitSlop={8}
          activeOpacity={0.7}
          onPress={handleOnPressLike}
          disabled={isPendingLike || isPendingUnlike}
        >
          {isPendingLike || isPendingUnlike ? (
            <View
              style={{
                width: 16,
                height: 16,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Loading size={20} color={theme.colors.blue} />
            </View>
          ) : (
            <AnimatedHeart liked={liked} />
          )}
          <Text size={14} color={liked ? '#FF4848' : ''}>
            {isPendingLike || isPendingUnlike
              ? 'Carregando...'
              : liked
                ? 'Curtido'
                : 'Curtir'}
          </Text>
        </S.ActionItem>

        <S.ActionItem
          hitSlop={8}
          activeOpacity={0.7}
          onPress={() => {
            if (shouldReplyNavigateToPostPage) {
              navigation.navigate('PostScreen', {
                postId: post.id,
              });
            } else {
              replyRef?.current?.present();
            }
          }}
        >
          <Reply />
          <Text size={14}>Comentar</Text>
          {shouldOpenReplyBottomSheet && (
            <Replies
              ref={replyRef}
              liked={liked}
              post={post}
              onPressLike={handleOnPressLike}
              setReplies={setReplies}
            />
          )}
        </S.ActionItem>

        <S.ActionItem
          hitSlop={8}
          activeOpacity={0.7}
          onPress={() => bottomShareRef?.current?.present()}
          disabled={isPendingShare || isPendingUnshare}
        >
          <ShareList ref={sharesListBottomRef} post={post} />
          {isPendingShare || isPendingUnshare ? (
            <View
              style={{
                width: 16,
                height: 16,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Loading size={20} color={theme.colors.blue} />
            </View>
          ) : (
            <Share color={shared ? '#00BA7C' : ''} />
          )}
          <Text size={14} color={shared ? '#00BA7C' : ''}>
            {isPendingShare || isPendingUnshare
              ? 'Carregando...'
              : shared
                ? 'Compartilhado'
                : 'Compartilhar'}
          </Text>
        </S.ActionItem>
        <Likes ref={likeBottomSheetRef} count={likes} postId={post.id} />
        <BottomSheet ref={bottomShareRef} snapPoints={['20%']}>
          <BottomSheetButton
            onPress={handleShare}
            disabled={isPendingShare || isPendingUnshare}
          >
            {isPendingShare || isPendingUnshare ? (
              <>
                <Loading color={'#333'} size={18} />
                <Text>Carregando...</Text>
              </>
            ) : (
              <>
                <Share />
                <Text>{shared ? 'Descompartilhar' : 'Compartilhar'}</Text>
              </>
            )}
          </BottomSheetButton>
          <BottomSheetButton
            onPress={() => {
              navigation.navigate('Publish', {
                post: post,
                isSharing: true,
              });
              bottomShareRef.current?.close();
            }}
          >
            <Edit />
            <Text>Comentar</Text>
          </BottomSheetButton>
        </BottomSheet>
      </S.ActionsContainer>
    );
  }
);

PostActions.displayName = 'PostActions';
