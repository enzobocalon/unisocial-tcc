import { StackScreenProps } from '@react-navigation/stack';
import { StackParams } from '../../types/Navigation';
import * as S from './styles';
import ScreenHeader from '../../components/ScreenHeader';
import { Text } from '../../components/Text';
import { View } from 'react-native';
import { useNewTask } from './useNewTask';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Button } from '../../components/Button';
import { Controller } from 'react-hook-form';
import { Loading } from '../../components/Loading';

type Props = StackScreenProps<StackParams, 'NewTask'>;

export function NewTask({ route }: Props) {
  const {
    theme,
    showDatePicker,
    isDatePickerVisible,
    handleConfirm,
    dueDate,
    formatDate,
    handleSubmitData,
    control,
    errors,
    isPending,
  } = useNewTask(
    route.params.assignmentId,
    route.params.taskId,
    route.params.selectedUsers
  );

  return (
    <S.Container>
      <ScreenHeader
        renderBackButton
        text={route.params.taskId ? 'Editar Tarefa' : 'Nova Tarefa'}
        renderRightComponent={() => <View></View>}
      />
      <S.Wrapper>
        <S.Item>
          <Text weight="Semibold" size={18}>
            Título
          </Text>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <S.Input
                value={value}
                onChangeText={onChange}
                placeholder="Título da tarefa..."
                style={{
                  color: 'black',
                }}
                placeholderTextColor={theme.colors.lightGray}
              />
            )}
          />
          {errors.name && (
            <Text
              weight="Semibold"
              color={theme.colors.error.primary}
              size={14}
              style={{ marginTop: 4 }}
            >
              {errors.name.message}
            </Text>
          )}
        </S.Item>
        <S.Item style={{ marginTop: 8 }}>
          <Text weight="Semibold" size={18}>
            Descrição
          </Text>
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, value } }) => (
              <S.Input
                multiline
                textAlignVertical="top"
                numberOfLines={5}
                value={value}
                placeholder="Adicione uma descrição"
                onChangeText={onChange}
                style={{
                  color: 'black',
                }}
                placeholderTextColor={theme.colors.lightGray}
              />
            )}
          />
          {errors.description && (
            <Text
              weight="Semibold"
              color={theme.colors.error.primary}
              size={14}
              style={{ marginTop: 4 }}
            >
              {errors.description.message}
            </Text>
          )}
        </S.Item>
        <S.Item style={{ marginTop: 8 }}>
          <Text weight="Semibold" size={18}>
            Data de Entrega
          </Text>
          <S.Button>
            <Text
              weight="Semibold"
              color={theme.colors.blue}
              onPress={showDatePicker}
            >
              {dueDate ? formatDate(dueDate) : 'Selecionar data'}
            </Text>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="datetime"
              onConfirm={handleConfirm}
              onCancel={showDatePicker}
            />
          </S.Button>
          {errors.dueDate && (
            <Text
              weight="Semibold"
              color={theme.colors.error.primary}
              size={14}
              style={{ marginTop: 4 }}
            >
              {errors.dueDate.message}
            </Text>
          )}
        </S.Item>
        <Button
          style={{
            marginTop: 24,
          }}
          onPress={handleSubmitData}
          disabled={isPending}
        >
          {isPending ? (
            <Loading color={theme.colors.blue} />
          ) : (
            <Text weight="Semibold" color="white">
              Salvar
            </Text>
          )}
        </Button>
      </S.Wrapper>
    </S.Container>
  );
}
