import { ReactNode } from 'react';
import * as S from './styles';
import { CircledCross } from '../Icons/CircledCross';
import { useTheme } from 'styled-components';

interface Props {
  children: ReactNode;
  useIcon?: boolean;
}

export function Error({ children, useIcon = true }: Props) {
  const theme = useTheme();
  return (
    <S.Container>
      {useIcon && <CircledCross color={theme.colors.error.primary} />}
      <S.Error weight="Semibold" size={14}>
        {children}
      </S.Error>
    </S.Container>
  );
}
