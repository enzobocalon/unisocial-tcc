import DropDownPicker from 'react-native-dropdown-picker';
import * as S from './styles';
import { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Error } from '../Error';
import { Loading } from '../Loading';
import { useTheme } from 'styled-components';
import { View } from 'react-native';

type Props = React.ComponentProps<typeof DropDownPicker> & {
  error?: string;
  loading?: boolean;
};

export function Picker({ loading, ...props }: Props) {
  const { value, placeholder, disabled, containerStyle } = props;
  const [focus, setFocus] = useState(false);
  const shouldChangePosition = focus || value;
  const theme = useTheme();
  return (
    <S.Container style={containerStyle}>
      <S.StyledPicker
        {...props}
        placeholder=""
        onOpen={() => setFocus(true)}
        onClose={() => setFocus(false)}
        containerStyle={{ margin: 0 }}
        error={!!props.error}
        disabled={loading || disabled}
        arrowIconStyle={
          {
            tintColor: props.error ? theme.colors.error.primary : undefined,
          } as any // tintColor nao existe dentro dos tipos de arrowIconStyle por algum motivo
        }
      />
      <S.AnimatedView
        animate={{
          left: shouldChangePosition ? 12 : 8,
          top: loading ? 14 : !shouldChangePosition ? 14 : -12,
        }}
        transition={{ type: 'timing', duration: 100 }}
        loading={loading}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            props.setOpen((prev) => !prev);
            setFocus(true);
          }}
        >
          {loading ? (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
              }}
            >
              <Loading color={theme.colors.blue} />
            </View>
          ) : (
            <S.Text
              color={props.error ? theme.colors.error.primary : undefined}
              focus={focus || !!value}
            >
              {placeholder}
            </S.Text>
          )}
        </TouchableOpacity>
      </S.AnimatedView>
      {props.error && <Error>{props.error}</Error>}
    </S.Container>
  );
}
