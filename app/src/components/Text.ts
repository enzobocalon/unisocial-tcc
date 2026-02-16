import Animated from 'react-native-reanimated';
import styled from 'styled-components/native';

interface TextProps {
  weight?: 'Regular' | 'Semibold' | 'Bold' | 'Medium';
  color?: string;
  size?: number;
  opacity?: number;
  align?: 'right' | 'center' | 'left';
}

export const Text = styled.Text<TextProps>`
  font-family: ${({ weight }) =>
    weight ? `GeneralSans-${weight}` : 'GeneralSans-Regular'};
  color: ${({ color }) => color || '#222'};
  font-size: ${({ size }) => (size ? `${size}px` : '16px')};
  opacity: ${({ opacity }) => opacity || 1};
  ${({ align }) => align && `text-align: ${align}`};
`;

export const AnimatedText = styled(Animated.Text)<TextProps>`
  font-family: ${({ weight }) =>
    weight ? `GeneralSans-${weight}` : 'GeneralSans-Regular'};
  color: ${({ color }) => color || '#222'};
  font-size: ${({ size }) => (size ? `${size}px` : '16px')};
  opacity: ${({ opacity }) => opacity || 1};
  ${({ align }) => align && `text-align: ${align}`};
`;
