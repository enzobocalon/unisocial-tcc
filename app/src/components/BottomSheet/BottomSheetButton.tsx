import * as S from './styles';
import { MotiPressableProps } from 'moti/interactions';
import { CustomPressable } from '../CustomPressable';

interface ModalButtonProps extends MotiPressableProps {
  children: React.ReactNode;
}

export function BottomSheetButton({
  children,
  onPress,
  ...props
}: ModalButtonProps) {
  return (
    <CustomPressable
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
      }}
      {...props}
    >
      {children}
    </CustomPressable>
  );
}
