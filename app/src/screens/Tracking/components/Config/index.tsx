import { Switch } from 'react-native';
import { Text } from '../../../../components/Text';
import * as S from './styles';
import { useTrackingConfig } from './useTrackingConfig';

export function TrackingConfig() {
  const { theme, enableConfig, toggleEnableConfig } = useTrackingConfig();
  return (
    <S.Container>
      <Text weight="Bold" size={24}>
        Configurações de Rastreio
      </Text>

      <S.Content>
        <S.Item>
          <S.ItemTextWrapper>
            <Text numberOfLines={2} size={18}>
              Ativar rastreio automaticamente ao abrir
            </Text>
          </S.ItemTextWrapper>
          <Switch value={enableConfig} onValueChange={toggleEnableConfig} />
        </S.Item>
      </S.Content>
    </S.Container>
  );
}
