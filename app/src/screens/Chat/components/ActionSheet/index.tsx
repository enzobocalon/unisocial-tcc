import { forwardRef } from 'react';
import { BottomSheet } from '../../../../components/BottomSheet';
import { Text } from '../../../../components/Text';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import * as S from './styles';
import { Trash } from '../../../../components/Icons/Trash';
import { Cross } from '../../../../components/Icons/Cross';
import { useTheme } from 'styled-components';
import { Loading } from '../../../../components/Loading';

interface Props {
  onDelete: () => void;
  showDelete: boolean;
  onDismiss?: () => void;
  isPending?: boolean;
}

const ActionSheet = forwardRef<BottomSheetModal, Props>(
  ({ onDelete, onDismiss, showDelete, isPending }, ref) => {
    function localOnDismiss() {
      onDismiss && onDismiss();
      if (ref && 'current' in ref) {
        ref.current?.close();
      }
    }
    const theme = useTheme();
    return (
      <BottomSheet
        ref={ref}
        snapPoints={['50%']}
        useBackdrop
        onDismiss={onDismiss}
      >
        <S.Container>
          {showDelete && (
            <S.Button
              onPress={() => {
                onDelete();
                localOnDismiss();
              }}
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loading color={theme.colors.error.primary} />
                  <Text color={theme.colors.error.primary}>Carregando...</Text>
                </>
              ) : (
                <>
                  <Trash color={theme.colors.error.primary} />
                  <Text color={theme.colors.error.primary}>Apagar</Text>
                </>
              )}
            </S.Button>
          )}
          <S.Button onPress={localOnDismiss}>
            <Cross />
            <Text>Cancelar</Text>
          </S.Button>
        </S.Container>
      </BottomSheet>
    );
  }
);

ActionSheet.displayName = 'ActionSheet';

export { ActionSheet };
