import { useNavigation } from '@react-navigation/native';
import { Parent } from '../../../__generated__/graphql';
import { useMention } from '../../../hooks/useMention';
import { textSlicer } from '../../../utils/textSlicer';
import { MediaGrid } from '../../Medias/MediaGrid';
import { Text } from '../../Text';
import { Author } from '../Author';
import * as S from './styles';
import { StackProps } from '../../../types/Navigation';

interface ParentPost {
  post: Parent;
  disablePress?: boolean;
  isDeleted?: boolean;
}

export function ParentPost({
  post,
  disablePress = false,
  isDeleted,
}: ParentPost) {
  const { replaceMetaTag } = useMention();
  const navigation = useNavigation<StackProps>();
  return (
    <S.Container
      activeOpacity={0.8}
      disabled={disablePress || isDeleted}
      onPress={() => navigation.navigate('PostScreen', { postId: post.id })}
    >
      {isDeleted ? (
        <Text>Apagado</Text>
      ) : (
        <>
          <S.AuthorContainer>
            <Author user={post.user} timestamp={post.createdAt} />
          </S.AuthorContainer>
          {post.content && (
            <Text style={{ marginTop: 8 }}>
              {replaceMetaTag(textSlicer(post.content), (userId: string) => {
                navigation.navigate('UserProfile', { userId });
              })}
            </Text>
          )}
          {post.media && !post.content && <MediaGrid sources={post.media} />}
        </>
      )}
    </S.Container>
  );
}
