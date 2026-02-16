import { StackScreenProps } from '@react-navigation/stack';
import * as S from './styles';
import { StackParams } from '../../types/Navigation';
import { Text } from '../../components/Text';
import ScreenHeader from '../../components/ScreenHeader';
import { FlatList, RefreshControl, View } from 'react-native';
import { Search } from '../../components/Icons/Search';
import { useFiles } from './useFiles';
import { Avatar } from '../../components/Avatar';
import { File } from '../../components/Icons/File';
import { Loading } from '../../components/Loading';
import { BottomSheet } from '../../components/BottomSheet';
import { Trash } from '../../components/Icons/Trash';
import { Download } from '../../components/Icons/Download';

type ScreenProps = StackScreenProps<StackParams, 'Files'>;

export function Files({ route }: ScreenProps) {
  const {
    data,
    hasNextPage,
    fetchNextPage,
    isLoading,
    theme,
    searchVal,
    setSearchVal,
    handleSearch,
    hasMoreSearchPages,
    searchPage,
    onRefresh,
    refreshing,
    bottomSheetRef,
    handleSelectItem,
    setSelectedItem,
    selectedItem,
    user,
    assignment,
    task,
    handleDownloadFile,
    deleteFile,
    isPendingDelete,
    isDownloading,
  } = useFiles(route.params.taskId, route.params.assignmentId);

  return (
    <S.Container>
      <ScreenHeader
        renderBackButton
        renderRightComponent={() => <View></View>}
        text="Todos os Arquivos"
      />
      {isLoading ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Loading size={56} color={theme.colors.blue} />
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.user.id}
          renderItem={({ item }) => (
            <>
              <S.Row>
                <Avatar size={36} source={item.user.user.avatar} />
                <Text size={20} weight="Semibold" numberOfLines={1}>
                  {item.user.user.name}
                </Text>
              </S.Row>
              {item.files.map((file) => (
                <S.Button
                  key={file.id}
                  activeOpacity={0.7}
                  onPress={() => handleSelectItem(item.user, file)}
                >
                  <S.Row
                    style={{
                      marginVertical: 12,
                    }}
                  >
                    <File size={24} />
                    <Text size={18} numberOfLines={1}>
                      {file.filename}
                    </Text>
                  </S.Row>
                </S.Button>
              ))}
            </>
          )}
          ListHeaderComponent={
            <S.SearchInputContainer>
              <Search />
              <S.SearchInput
                placeholder="Buscar arquivos por usuário..."
                value={searchVal!}
                onChangeText={setSearchVal}
                placeholderTextColor={theme.colors.lightGray}
              />
            </S.SearchInputContainer>
          }
          contentContainerStyle={{
            padding: 16,
            flex: 1,
          }}
          onEndReached={async () => {
            if (searchVal) {
              if (hasMoreSearchPages) {
                await handleSearch(searchVal!, searchPage + 1);
              }
            } else if (hasNextPage) {
              if (!searchVal) {
                await fetchNextPage();
              }
            }
          }}
          ListEmptyComponent={() => (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text weight="Semibold" numberOfLines={1}>
                Nenhum arquivo encontrado
              </Text>
            </View>
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.colors.blue]}
            />
          }
        />
      )}

      <BottomSheet ref={bottomSheetRef} onDismiss={() => setSelectedItem(null)}>
        <S.BottomSheetButton
          onPress={handleDownloadFile}
          disabled={isDownloading}
        >
          {isDownloading ? (
            <>
              <Loading color="#333" />
              <Text>Carregando...</Text>
            </>
          ) : (
            <>
              <Download size={18} />
              <Text size={18}>Baixar</Text>
            </>
          )}
        </S.BottomSheetButton>
        {(selectedItem?.user.user.id === user?.me.id ||
          task?.ownerId === user?.me.id ||
          assignment?.ownerId === user?.me.id ||
          assignment?.isAdmin) && (
          <S.BottomSheetButton onPress={deleteFile}>
            {isPendingDelete ? (
              <>
                <Loading size={18} color={theme.colors.error.primary} />
                <Text size={18} color={theme.colors.error.primary}>
                  Carregando...
                </Text>
              </>
            ) : (
              <>
                <Trash size={18} color={theme.colors.error.primary} />
                <Text size={18} color={theme.colors.error.primary}>
                  Remover
                </Text>
              </>
            )}
          </S.BottomSheetButton>
        )}
      </BottomSheet>
    </S.Container>
  );
}
