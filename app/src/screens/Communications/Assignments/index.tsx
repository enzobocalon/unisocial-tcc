import { Tabs } from 'react-native-collapsible-tab-view';
import { Text } from '../../../components/Text';
import { FloatingButton } from '../../../components/FloatingButton';
import { Dimensions, RefreshControl, View } from 'react-native';
import { Loading } from '../../../components/Loading';
import { useAssignments } from './useAssignments';
import { StackPlus } from '../../../components/Icons/StackPlus';
import * as S from './styles';
import { AssignmentCard } from './components/Card';

// Adicionar search
export function Assignments() {
  const {
    navigation,
    theme,
    data,
    formatDay,
    isLoading,
    refreshing,
    onRefresh,
  } = useAssignments();
  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          marginTop: Dimensions.get('window').height / 2,
        }}
      >
        <Loading size={40} color={theme.colors.blue} />
      </View>
    );
  }

  return (
    <View
      style={{
        position: 'relative',
        height: '100%',
      }}
    >
      <Tabs.FlatList
        data={data}
        renderItem={({ item }) => {
          return (
            <S.Container>
              <Text
                size={18}
                weight="Semibold"
                style={{ marginLeft: 16, marginBottom: 8 }}
              >
                {new Date(item.dueDate).toISOString().split('T')[0] ===
                  '1970-01-01'
                  ? 'Atividades Completas'
                  : formatDay(item.dueDate)}
              </Text>
              {item.item.length > 0 && (
                <AssignmentCard
                  key={item.item[0].id + item.dueDate}
                  assignment={item.item[0]}
                  dueDate={item.dueDate}
                  taskCount={item.item.length}
                />
              )}
            </S.Container>
          );
        }}
        style={{
          marginTop: -32,
        }}
        ListHeaderComponent={() => <View style={{ marginTop: 36 }}></View>}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.blue]}
          />
        }
        ListEmptyComponent={() => (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text weight="Semibold" numberOfLines={1}>
              Nenhuma atividade encontrada.
            </Text>
          </View>
        )}
      />
      <View
        style={{
          position: 'absolute',
          bottom: 16,
          right: 0,
        }}
      >
        <FloatingButton
          onPress={() =>
            navigation.navigate('UserSelection', {
              isAssignment: true,
              isTask: false,
              reset: true,
            })
          }
          icon={() => <StackPlus color="white" size={28} />}
          size={64}
        />
      </View>
    </View>
  );
}
