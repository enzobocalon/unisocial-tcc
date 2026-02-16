import { ActivityIndicator } from 'react-native';
import * as S from './styles';
import { useTheme } from 'styled-components';
import { isAndroid } from '../../lib/constants';

interface LoadingProps {
  size?: number | 'small' | 'large';
  color?: string;
}

export function Loading({ color, size}: LoadingProps) {
  const theme = useTheme();
  return (
    <S.Container>
      <ActivityIndicator
        color={color || theme.colors.white}
        size={
          typeof size === 'number'
            ? isAndroid
              ? size
              : size > 36
                ? 'large'
                : 'small'
            : size
        }
      />
    </S.Container>
  );
}
