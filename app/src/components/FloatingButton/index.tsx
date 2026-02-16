import { CustomPressable } from '../CustomPressable';
import { Add } from '../Icons/Add';
import { Loading } from '../Loading';
import * as S from './styles';

interface Props {
  icon?: React.FC | JSX.Element;
  onPress: () => void;
  size?: number;
  isLoading?: boolean;
}

export function FloatingButton({ icon, onPress, size, isLoading }: Props) {
  return (
    <S.Container size={size}>
      <CustomPressable
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          width: '100%',
        }}
        onPress={onPress}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loading size={20} />
        ) : (
          icon || <Add color="white" size={20} />
        )}
      </CustomPressable>
    </S.Container>
  );
}
