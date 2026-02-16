import { MotiPressableProps } from 'moti/interactions';
import React, { useMemo } from 'react';
import * as S from './styles';
import { Loading } from '../Loading';
import { useTheme } from 'styled-components';

interface Props extends MotiPressableProps {
  loading?: boolean;
  children: React.ReactNode;
}

export function Button({ children, loading, disabled, ...props }: Props) {
  const theme = useTheme();
  return (
    <S.StyledPressable
      {...props}
      animate={useMemo(
        () =>
          ({ pressed }) => {
            'worklet';

            return {
              scale: pressed ? 0.95 : 1,
            };
          },
        []
      )}
      disabled={loading || disabled}
    >
      {loading && <Loading size={24} color={theme.colors.blue} />}
      {!loading && children}
    </S.StyledPressable>
  );
}
