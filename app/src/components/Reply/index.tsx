import { FlatList } from 'react-native';
import { Reply as IReply } from '../../__generated__/graphql';
import { dateFormat } from '../../utils/dateFormat';
import { AnimatedHeart } from '../AnimatedHeart';
import { Avatar } from '../Avatar';
import { Text } from '../Text';
import * as S from './styles';
import { useReply } from './useReply';
import { Pressable, View } from 'react-native';
import { ReplyPopup } from './Popup';
import { MediaGrid } from '../Medias/MediaGrid';
import React, { useMemo } from 'react';

interface ReplyProps {
  hasChildrenReply?: boolean;
  isParent?: boolean;
  reply: IReply;
  onReplySelection: (reply: IReply) => void;
  onEdit: (reply: IReply | null) => void;
  setReplies: React.Dispatch<React.SetStateAction<number>>;
  parentPage?: number;
  queryKey?: string;
  sheetClose?: () => void;
}

function ReplyInternal({
  hasChildrenReply,
  isParent,
  reply,
  onReplySelection,
  onEdit,
  setReplies,
  queryKey,
  sheetClose,
}: ReplyProps) {
  const {
    liked,
    onLikeReply,
    likes,
    data,
    hasMoreData,
    replaceMetaTag,
    openReplyPopup,
    handlePopUpClose,
    handlePopUpOpen,
    fetchNextPage,
    navigation,
    contentWidth,
    setContentWidth,
    isPendingLike,
    isPendingUnlike,
  } = useReply(reply, queryKey);
  if (!reply) {
    return;
  }

  const avatar = useMemo(() => reply.user.avatar, [reply.user.avatar]);

  return (
    <S.Container hasChildrenReply={hasChildrenReply} isParent={isParent}>
      <S.PopupContainer isParent={!!isParent}>
        <ReplyPopup
          open={openReplyPopup}
          onClose={handlePopUpClose}
          reply={reply}
          onEdit={onEdit}
          setReplies={setReplies}
          queryKey={queryKey || 'timeline'}
        />
      </S.PopupContainer>
      <Avatar size={32} source={avatar} />
      <S.Wrapper>
        <Pressable onLongPress={handlePopUpOpen}>
          <Text size={14} weight="Bold">
            {reply.user.name}
          </Text>
          <S.Content
            onLayout={(event) =>
              setContentWidth(event.nativeEvent.layout.width)
            }
          >
            <Text size={16}>
              {reply.content &&
                replaceMetaTag(reply.content, (userId: string) => {
                  if (sheetClose) {
                    sheetClose();
                  }
                  navigation.navigate('UserProfile', { userId });
                })}
            </Text>
            {reply.medias && (
              <MediaGrid sources={reply.medias} width={contentWidth - 16 - 2} />
            )}
          </S.Content>
        </Pressable>
        <S.ActionsStatsContainer>
          <S.ActionsStatsWrapper>
            <S.Stats>
              <Text size={14} weight="Semibold">
                {dateFormat(reply.createdAt)}
              </Text>
            </S.Stats>
            <S.Touchable
              onPress={onLikeReply}
              disabled={isPendingLike || isPendingUnlike}
            >
              <Text size={14} weight="Semibold">
                {isPendingLike || isPendingUnlike
                  ? 'Carregando...'
                  : liked
                    ? 'Descurtir'
                    : 'Curtir'}
              </Text>
            </S.Touchable>
            <S.Touchable onPress={() => onReplySelection(reply)}>
              <Text size={14} weight="Semibold">
                Responder
              </Text>
            </S.Touchable>
          </S.ActionsStatsWrapper>
          <S.Stats>
            <AnimatedHeart liked={liked} size={14} />
            <Text size={14} weight="Semibold">
              {likes}
            </Text>
          </S.Stats>
        </S.ActionsStatsContainer>
        {hasChildrenReply && (
          <>
            <S.Touchable onPress={() => fetchNextPage()}>
              {hasMoreData && (
                <Text size={14} weight="Semibold">
                  Mostrar respostas
                </Text>
              )}
            </S.Touchable>
            <S.RepliesContainer>
              <FlatList
                data={data}
                renderItem={({ item }) => (
                  <View
                    style={{
                      paddingBottom: 8,
                    }}
                  >
                    <Reply
                      key={item.id}
                      hasChildrenReply={false}
                      reply={item}
                      onReplySelection={onReplySelection}
                      onEdit={() => onEdit(item)}
                      setReplies={setReplies}
                      sheetClose={sheetClose}
                    />
                  </View>
                )}
                nestedScrollEnabled
                CellRendererComponent={({ children }) => children}
                removeClippedSubviews={false}
              />
            </S.RepliesContainer>
          </>
        )}
      </S.Wrapper>
    </S.Container>
  );
}

export const Reply = React.memo(ReplyInternal, (prev, next) => {
  return (
    prev.reply.id === next.reply.id &&
    prev.reply.user.avatar === next.reply.user.avatar &&
    prev.reply.likes === next.reply.likes &&
    prev.reply.content === next.reply.content &&
    prev.hasChildrenReply === next.hasChildrenReply
  );
});
