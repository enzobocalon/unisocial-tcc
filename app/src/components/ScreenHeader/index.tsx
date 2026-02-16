import { TouchableOpacity, ViewStyle } from 'react-native';
import * as S from './styles';
import { Menu } from '../Icons/Menu';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { Text } from '../Text';
import { APP_NAME } from '../../lib/constants';
import { Chat } from '../Icons/Chat';
import { LeftArrow } from '../Icons/LeftArrow';
import { StackProps } from '../../types/Navigation';
import { AnimatePresence } from 'moti';

interface Props {
  renderMidComponent?: () => JSX.Element;
  renderBackButton?: boolean;
  renderRightComponent?: () => JSX.Element;
  shouldMidComponentBeCentered?: boolean;
  containerStyle?: ViewStyle;
  text?: string;
  renderLeftComponent?: () => JSX.Element | undefined;
  goBackFn?: () => void;
}

function ScreenHeader({
  renderMidComponent,
  renderBackButton,
  renderRightComponent,
  containerStyle,
  text,
  renderLeftComponent = undefined,
  shouldMidComponentBeCentered = true,
  goBackFn,
}: Props) {
  const navigation = useNavigation<StackProps>();
  return (
    <S.Container style={containerStyle}>
      <S.Wrapper>
        {typeof renderLeftComponent === 'function' &&
        renderLeftComponent() !== undefined ? (
          renderLeftComponent()
        ) : renderBackButton ? (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => (goBackFn ? goBackFn() : navigation.goBack())}
            hitSlop={8}
          >
            <LeftArrow size={20} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            hitSlop={8}
          >
            <Menu size={20} />
          </TouchableOpacity>
        )}

        <S.CenterContainer isCentered={shouldMidComponentBeCentered}>
          <AnimatePresence exitBeforeEnter>
            {renderMidComponent ? (
              renderMidComponent()
            ) : (
              <Text weight="Bold">{text || APP_NAME}</Text>
            )}
          </AnimatePresence>
        </S.CenterContainer>
      </S.Wrapper>
      {renderRightComponent ? (
        renderRightComponent()
      ) : (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => navigation.navigate('Communications')}
          hitSlop={8}
        >
          <Chat size={20} />
        </TouchableOpacity>
      )}
    </S.Container>
  );
}

export default ScreenHeader;
