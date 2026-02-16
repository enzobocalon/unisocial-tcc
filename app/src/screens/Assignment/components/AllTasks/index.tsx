import { useAllTasks } from './useAllTasks';
import { Tabs } from 'react-native-collapsible-tab-view';
import { Text } from '../../../../components/Text';
import { RefreshControl, View } from 'react-native';
import { TaskCard } from '../TaskCard';

interface Props {
  assignmentId: string;
}

export function AllTasks({ assignmentId }: Props) {
  const {
    data,
    formatDay,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isRefetching,
    refetch,
    theme,
  } = useAllTasks(assignmentId);

  return (
    <Tabs.FlatList
      data={data}
      renderItem={({ item }) => {
        return (
          <View style={{ marginTop: 16 }}>
            <Text size={18} weight="Semibold" style={{ marginLeft: 16 }}>
              {new Date(item.dueDate).toISOString().split('T')[0] ===
                '1970-01-01'
                ? 'Tarefas Completas'
                : formatDay(item.dueDate)}
            </Text>
            {item.item.map((i) => (
              <TaskCard
                task={i}
                dueDate={item.dueDate}
                key={i.id}
                shouldNotRenderCustomIcons
              />
            ))}
          </View>
        );
      }}
      ListEmptyComponent={() => (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text size={18} weight="Semibold">
            Nenhuma tarefa encontrada
          </Text>
        </View>
      )}
      keyExtractor={(item) => item.dueDate}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={refetch}
          colors={[theme.colors.blue]} // <-- cor do spinner (Android)
          tintColor={theme.colors.blue} // <-- cor do spinner (iOS)
          progressBackgroundColor="#fff" // (opcional) cor do fundo no Android
        />
      }
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }}
      onEndReachedThreshold={0.3}
    />
  );
}
