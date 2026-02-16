import { Actions } from '../../../__generated__/graphql';
import { Avatar } from '../../Avatar';
import { Text } from '../../Text';
import * as S from './styles';
import { useUserAction } from './useUserAction';

interface UserActionProps {
  actions: Actions[];
}

export function UserAction({ actions }: UserActionProps) {
  const { getAuthors, getActionType } = useUserAction(actions);
  const message = getActionType();
  const authors = getAuthors();
  return (
    <S.Container>
      <S.AvatarWrapper>
        <Avatar size={24} source={actions[0].author?.avatar} />
      </S.AvatarWrapper>
      <S.TextWrapper>
        <Text numberOfLines={2}>
          <Text size={14} weight="Bold">
            {authors}
          </Text>
          <Text size={14}> {message}</Text>
        </Text>
      </S.TextWrapper>
    </S.Container>
  );
}
