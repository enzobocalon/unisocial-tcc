import { useTheme } from 'styled-components';
import { Loading } from '../Loading';
import * as S from './styles';

interface FloatingLoadingProps {
  isLoading: boolean;
}

export function FloatingLoading({ isLoading = false }: FloatingLoadingProps) {
  if (!isLoading) return null;
  const theme = useTheme();

  return (
    <S.LoadingMoreContainer>
      <S.LoadingMoreWrapper>
        <Loading size={32} color={theme.colors.blue} />
      </S.LoadingMoreWrapper>
    </S.LoadingMoreContainer>
  );
}
