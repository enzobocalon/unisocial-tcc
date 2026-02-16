import { PressableProps, StyleProp, ViewStyle } from 'react-native';
import * as S from './styles';

export function CustomPressable({
  children,
  onPress,
  style,
  ...props
}: PressableProps) {
  return (
    <S.Pressable
      {...props}
      android_ripple={{
        color: 'rgba(0, 0, 0, 0.2)',
        foreground: true,
      }}
      style={({ pressed }) =>
        [S.handlePressOnIos(pressed), style] as StyleProp<ViewStyle>
      }
      onPress={onPress}
    >
      {children}
    </S.Pressable>
  );
}
