import * as S from '../../styles';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { LeftArrow } from '../../../../components/Icons/LeftArrow';
import { Task as TaskIcon } from '../../../../components/Icons/Task';
import { Text } from '../../../../components/Text';
import { Calendar } from '../../../../components/Icons/Calendar';
import { Check } from '../../../../components/Icons/Check';
import { Edit } from '../../../../components/Icons/Edit';
import { User } from '../../../../components/Icons/User';
import { Add } from '../../../../components/Icons/Add';
import { FileCard } from '../FileCard';
import { BottomSheet } from '../../../../components/BottomSheet';
import { Trash } from '../../../../components/Icons/Trash';
import { Download } from '../../../../components/Icons/Download';
import { AssignmentTask } from '../../../../__generated__/graphql';
import { AddCircle } from '../../../../components/Icons/AddCircle';
import { useTaskHeader } from './useTaskHeader';
import { Checks } from '../../../../components/Icons/Checks';
import { Loading } from '../../../../components/Loading';

interface Props {
  task: AssignmentTask;
}

export function TaskHeader({ task }: Props) {
  const {
    bottomSheetRef,
    formatDate,
    navigation,
    theme,
    tagAsCompleted,
    handleDocuments,
    isPendingFiles,
    uploadFiles,
    scrollEnabled,
    files,
    setSelectedFile,
    handleScrollEnable,
    selectedFile,
    deleteFile,
    isPending,
    assignment,
    user,
    handleDownloadFile,
    isPendingTagAsCompleted,
    isPendingDeleteFile,
    isDownloading,
    openBottomSheet,
  } = useTaskHeader(task);

  const state = navigation.getState();
  const routes = state.routes;
  const previousRoute = routes[routes.length - 2];

  return (
    <>
      <S.TopBar>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            if (previousRoute?.name === 'NewTask') {
              navigation.pop(3);
            } else {
              navigation.goBack();
            }
          }}
          hitSlop={8}
        >
          <LeftArrow />
        </TouchableOpacity>
        {isPendingFiles && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={uploadFiles}
            disabled={isPending}
          >
            {isPending ? (
              <Loading color={theme.colors.blue} />
            ) : (
              <Text color={theme.colors.blue} weight="Semibold">
                Enviar
              </Text>
            )}
          </TouchableOpacity>
        )}
      </S.TopBar>

      <S.Header>
        <S.Icon
          style={{
            borderWidth: 2,
            borderColor: '#808080',
          }}
        >
          <TaskIcon size={32} color="#808080" />
        </S.Icon>
        <S.TextContainer>
          <Text size={22} weight="Semibold" numberOfLines={1}>
            {task.name}
          </Text>
        </S.TextContainer>
        <S.TextContainer>
          <Text style={{ opacity: task.description ? 1 : 0.5 }}>
            {task.description || 'Nenhuma descrição fornecida.'}
          </Text>
        </S.TextContainer>
        <S.TextContainer>
          <S.Row>
            <Calendar size={24} />
            <Text weight="Semibold">{formatDate(task.dueDate)}</Text>
          </S.Row>
        </S.TextContainer>
        {task.ownerId === user?.me.id && (
          <Text
            align="center"
            style={{
              marginTop: 16,
            }}
            size={14}
          >
            Você é o dono desta tarefa.
          </Text>
        )}
      </S.Header>

      <S.QuickActions>
        {task.isMember && (
          <S.QuickAction
            onPress={tagAsCompleted}
            activeOpacity={0.7}
            disabled={isPendingTagAsCompleted}
          >
            {isPendingDeleteFile ? (
              <>
                <Loading color={theme.colors.blue} />
                <Text size={14}>Carregando...</Text>
              </>
            ) : !task.completed ? (
              <>
                <Check />
                <Text size={14}>Concluir</Text>
              </>
            ) : (
              <>
                <Checks size={16} />
                <Text size={14}>Concluído</Text>
              </>
            )}
          </S.QuickAction>
        )}
        {(assignment?.isAdmin || task.ownerId === user?.me.id) && (
          <S.QuickAction
            activeOpacity={0.7}
            onPress={() =>
              navigation.navigate('NewTask', {
                assignmentId: task.assignmentId,
                taskId: task.id,
              })
            }
          >
            <Edit />
            <Text size={14}>Editar Tarefa</Text>
          </S.QuickAction>
        )}
        {(assignment?.isAdmin || task.ownerId === user?.me.id) && (
          <S.QuickAction
            onPress={() =>
              navigation.navigate('AddUsers', {
                assignmentId: task.assignmentId,
                taskId: task.id,
              })
            }
            activeOpacity={0.7}
          >
            <User />
            <Text size={14}>Adicionar</Text>
          </S.QuickAction>
        )}
      </S.QuickActions>

      {(assignment?.isAdmin ||
        task.ownerId === user?.me.id ||
        task.isMember) && (
        <S.FilesContainer>
          <S.Row
            style={{
              justifyContent: 'space-between',
            }}
          >
            <Text weight="Semibold" size={18}>
              Seus Arquivos
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              hitSlop={16}
              onPress={handleDocuments}
            >
              <Add size={18} />
            </TouchableOpacity>
          </S.Row>
          <S.FilesWrapper>
            {files && files.length > 0 ? (
              <FlatList
                data={files}
                keyExtractor={(item) => item.url}
                horizontal
                scrollEnabled={scrollEnabled}
                onContentSizeChange={handleScrollEnable}
                contentContainerStyle={{
                  padding: 8,
                }}
                renderItem={({ item }) => (
                  <FileCard item={item} onPress={() => openBottomSheet(item)} />
                )}
              />
            ) : (
              <S.Button onPress={handleDocuments}>
                <S.Row>
                  <AddCircle size={18} />
                  <Text>Clique aqui para adicionar um arquivo</Text>
                </S.Row>
              </S.Button>
            )}
          </S.FilesWrapper>
        </S.FilesContainer>
      )}

      <S.Row
        style={{
          paddingHorizontal: 16,
          justifyContent: 'space-between',
        }}
      >
        <Text weight="Semibold" size={18}>
          Membros
        </Text>
        <Text size={14}>
          Entregues: {Math.max(0, task.completedCount)}/{task.totalCount}
        </Text>
      </S.Row>

      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={['50%']}
        useBackdrop
        onDismiss={() => setSelectedFile(null)}
      >
        <View>
          <View
            style={{
              paddingHorizontal: 16,
            }}
          >
            <Text weight="Semibold" size={14}>
              {selectedFile?.filename}
            </Text>
          </View>
          <S.Row>
            <S.ActionButton
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
                  <Download />
                  <Text>Baixar</Text>
                </>
              )}
            </S.ActionButton>
          </S.Row>

          <S.Row>
            <S.ActionButton onPress={deleteFile} disabled={isPendingDeleteFile}>
              {isPendingDeleteFile ? (
                <>
                  <Loading color={theme.colors.error.primary} />
                  <Text color={theme.colors.error.primary}>Carregando...</Text>
                </>
              ) : (
                <>
                  <Trash color={theme.colors.error.primary} />
                  <Text color={theme.colors.error.primary}>Remover</Text>
                </>
              )}
            </S.ActionButton>
          </S.Row>
        </View>
      </BottomSheet>
    </>
  );
}
