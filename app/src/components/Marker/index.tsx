import { useTheme } from 'styled-components';
import { Avatar } from '../Avatar';
import * as S from './styles';

interface MarkerProps {
  highlight?: boolean;
  avatar: string;
}

export function Marker({ highlight = false, avatar }: MarkerProps) {
  const theme = useTheme();
  return (
    <S.Container>
      <S.Wrapper highlight={highlight}>
        <Avatar
          size={36}
          containerStyle={{
            transform: [{ rotate: '45deg' }],
          }}
          style={{
            borderWidth: 1,
            borderColor: highlight ? 'white' : theme.colors.blue,
          }}
          source={avatar}
        />
      </S.Wrapper>
    </S.Container>
  );
}
