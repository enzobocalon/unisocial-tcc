import * as S from './styles';
import {
  BottomSheetBackdropProps,
  BottomSheetFooterProps,
  BottomSheetModal,
  BottomSheetModalProps,
} from '@gorhom/bottom-sheet';
import { forwardRef, useCallback, useMemo } from 'react';
import { SharedValue } from 'react-native-reanimated';
import { useTheme } from 'styled-components';
import { Loading } from '../Loading';

interface ModalProps extends BottomSheetModalProps {
  children: React.ReactNode;
  snapPoints?: string[];
  hideHandle?: boolean;
  animatedPosition?: SharedValue<number>;
  footerComponent?: React.FC<BottomSheetFooterProps>;
  useScrollableComponent?: boolean;
  useBackdrop?: boolean;
  loading?: boolean;
}

export const BottomSheet = forwardRef<BottomSheetModal, ModalProps>(
  (
    {
      children,
      snapPoints,
      hideHandle,
      animatedPosition,
      footerComponent,
      useScrollableComponent,
      useBackdrop = true,
      loading,
      ...props
    },
    ref
  ) => {
    const internalSnapPoints = useMemo(
      () => snapPoints || ['100%'],
      [snapPoints]
    );
    const theme = useTheme();

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <S.Overlay {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
      ),
      []
    );

    return (
      <BottomSheetModal
        snapPoints={internalSnapPoints}
        ref={ref}
        index={0}
        backdropComponent={useBackdrop ? renderBackdrop : undefined}
        handleStyle={hideHandle && { display: 'none' }}
        handleIndicatorStyle={hideHandle && { display: 'none' }}
        animatedPosition={animatedPosition}
        footerComponent={footerComponent}
        {...props}
      >
        {loading ? (
          <S.LoaderContainer>
            <Loading color={theme.colors.blue} size={'large'} />
          </S.LoaderContainer>
        ) : useScrollableComponent ? (
          children
        ) : (
          <S.Container>{children}</S.Container>
        )}
      </BottomSheetModal>
    );
  }
);

BottomSheet.displayName = 'BottomSheet';
