import { BaseUser } from '../../../__generated__/graphql';
import { dateFormat } from '../../../utils/dateFormat';
import { Avatar } from '../../Avatar';
import { Text } from '../../Text';
import * as S from './styles';

interface AuthorProps {
  user: BaseUser;
  timestamp: string;
}

export function Author({ user, timestamp }: AuthorProps) {
  return (
    <S.AuthorWrapper>
      <Avatar size={32} source={user.avatar} />

      <S.AuthorInfo>
        <Text weight="Bold" numberOfLines={1}>
          {user.name}
        </Text>

        <S.Secondary>
          <Text size={14} color="rgb(113, 118, 123)">
            @{user.username}
          </Text>
          <Text>·</Text>
          <Text size={14} color="rgb(113, 118, 123)">
            {dateFormat(timestamp)}
          </Text>
        </S.Secondary>
      </S.AuthorInfo>
    </S.AuthorWrapper>
  );
}
