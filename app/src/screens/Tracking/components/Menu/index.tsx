import { useTheme } from 'styled-components';
import { Gear } from '../../../../components/Icons/Gear';
import { Power } from '../../../../components/Icons/Power';
import { Text } from '../../../../components/Text';
import * as S from './styles';
import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { useQueryClient } from '@tanstack/react-query';

interface Props {
  enabled: boolean;
  toggleEnable: () => void;
  bottomSheetRef: React.MutableRefObject<BottomSheetModalMethods | null>;
  openConfig: () => void;
}

export function TrackingMenu({
  enabled,
  toggleEnable,
  bottomSheetRef,
  openConfig,
}: Props) {
  const theme = useTheme();
  const queryClient = useQueryClient();

  async function toggleEnableFn() {
    toggleEnable();
    await queryClient.refetchQueries({
      queryKey: ['tracking'],
    });
    bottomSheetRef.current?.dismiss();
  }

  function openConfigFn() {
    openConfig();
    bottomSheetRef.current?.dismiss();
  }

  return (
    <S.Container>
      <S.Item activeOpacity={0.7} onPress={openConfigFn}>
        <Gear />
        <Text size={18}>Configurações</Text>
      </S.Item>
      <S.Item
        style={{
          backgroundColor: theme.colors.error.light,
        }}
        activeOpacity={0.7}
        onPress={toggleEnableFn}
      >
        <Power color={theme.colors.error.primary} />
        <Text size={18} color={theme.colors.error.primary}>
          {enabled ? 'Desativar' : 'Ativar'}
        </Text>
      </S.Item>
    </S.Container>
  );
}
