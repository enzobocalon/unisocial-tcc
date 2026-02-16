import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import { useRef, useState } from 'react';
import { StackProps } from '../../types/Navigation';
import { PostActionsRef } from '../../types/Refs';
import { Post } from '../../__generated__/graphql';
import { useMention } from '../../hooks/useMention';
import { textSlicer } from '../../utils/textSlicer';

export function usePost(post: Post) {
  const hasUserAction = post.actions?.length && post.actions?.length > 0;
  const bottomSheetRef = useRef<PostActionsRef>(null);
  const optionsRef = useRef<BottomSheetModal>(null);
  const navigation = useNavigation<StackProps>();
  const { replaceMetaTag } = useMention();
  const content: string = post.content ? textSlicer(post.content) : '';

  const [likes, setLikes] = useState(post.likes);
  const [shares, setShares] = useState(post.shares);
  const [replies, setReplies] = useState(post.replies);

  return {
    hasUserAction,
    bottomSheetRef,
    optionsRef,
    navigation,
    likes,
    setLikes,
    shares,
    setShares,
    replies,
    setReplies,
    replaceMetaTag,
    content,
  };
}
