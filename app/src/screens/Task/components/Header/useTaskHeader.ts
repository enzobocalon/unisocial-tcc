import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import { useCallback, useRef, useState } from 'react';
import { useTheme } from 'styled-components';
import {
  AssignmentTask,
  DeleteFileMutation,
  GetAssignmentByIdQuery,
  GetTaskMembersQuery,
  GetTaskQuery,
  MediaSource,
  TagTaskAsCompletedMutation,
  TaskFiles,
  UploadFilesMutation,
  UploadFileToTaskDto,
} from '../../../../__generated__/graphql';
import { StackProps } from '../../../../types/Navigation';
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { makeGraphQLRequest } from '../../../../lib/graphQLClient';
import { TAG_TASK_AS_COMPLETED } from '../../../../services/assignments/mutations/tagTaskAsCompleted';
import Toast from 'react-native-toast-message';
import { useAuth } from '../../../../context/AuthContext';
import { pick } from '@react-native-documents/picker';
import { UPLOAD_TASK_FILE } from '../../../../services/assignments/mutations/uploadFile';
import { Dimensions, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { createPath } from '../../../../utils/path';
import { DELETE_FILE } from '../../../../services/assignments/mutations/deleteFile';
import { storage } from '../../../../lib/storage';
import * as ScopedStorage from 'react-native-scoped-storage';
import mime from 'mime';
import { useUpload } from '../../../../hooks/useUpload';
import { formatDateWithTime } from '../../../../utils/dateFormat';

export function useTaskHeader(task: AssignmentTask) {
  const navigation = useNavigation<StackProps>();
  const bottomSheetRef = useRef<BottomSheetModal | null>(null);
  const theme = useTheme();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [isPendingFiles, setIsPendingFiles] = useState(false);
  const [files, setFiles] = useState<TaskFiles[]>(task.files);
  const [scrollEnabled, setScrollEnabled] = useState(false);
  const screenWidth = Dimensions.get('screen').width;
  const [selectedFile, setSelectedFile] = useState<TaskFiles | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const [isPendingUploadFiles, setIsPendingUploadFiles] = useState(false);

  const { uploadFiles, isPending: isPendingUpload } = useUpload();

  const handleScrollEnable = useCallback((contentWidth: number) => {
    setScrollEnabled(contentWidth > screenWidth);
  }, []);

  function formatDate(isoString: string) {
    // Importar a função centralizada de formatação
    return formatDateWithTime(isoString);
  }

  const { mutateAsync: tagAsCompletedFn, isPending: isPendingTagAsCompleted } =
    useMutation({
      mutationKey: ['tagAsCompleted', task.id],
      mutationFn: async () => {
        const data = await makeGraphQLRequest<TagTaskAsCompletedMutation>({
          document: TAG_TASK_AS_COMPLETED,
          variables: { taskId: task.id },
        });

        return data.tagTaskAsCompleted;
      },
    });

  async function tagAsCompleted() {
    try {
      const { success, message } = await tagAsCompletedFn();

      if (success) {
        await Promise.all([
          queryClient.refetchQueries({
            queryKey: [
              'getAllTasksByAssignmentId',
              { assignmentId: assignment?.id },
            ],
          }),
          queryClient.refetchQueries({
            queryKey: [
              'getUserTasksByAssignmentId',
              { assignmentId: assignment?.id },
            ],
          }),
          queryClient.refetchQueries({
            queryKey: ['allAssignments'],
          }),
        ]);

        Toast.show({
          type: 'success',
          text1: task.completed
            ? 'Tarefa desmarcada como concluída'
            : 'Tarefa marcada como concluída',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Erro ao marcar tarefa como concluída',
          text2: message as string,
        });
      }
    } catch (e: any) {
      if ('message' in e) {
        console.error('ERROR-TAG-AS-COMPLETED:', e.message);
        Toast.show({
          type: 'error',
          text1: 'Erro ao marcar tarefa como concluída',
          text2: e.message,
        });
        return;
      }
      Toast.show({
        type: 'error',
        text1: 'Erro ao marcar tarefa como concluída',
        text2: 'Tente novamente mais tarde.',
      });
    }
  }

  const { mutateAsync: uploadFileFn, isPending: isPendingUploadMutation } =
    useMutation({
      mutationKey: ['uploadFiles'],
      mutationFn: async (data: UploadFileToTaskDto) => {
        const response = await makeGraphQLRequest<UploadFilesMutation>({
          document: UPLOAD_TASK_FILE,
          variables: { data },
        });

        return response.uploadFiles;
      },
    });

  async function handleDocuments() {
    try {
      const result = await pick({
        mode: 'open',
        allowMultiSelection: true,
      });
      setIsPendingFiles(true);
      setFiles((prev) => {
        const parsedFiles: TaskFiles[] = result.map((file) => ({
          filename: file.name ?? 'Arquivo sem nome',
          url: file.uri,
          taskId: 'UPLOAD',
          userId: user?.me.id as string,
          type: file.type as string,
        }));

        return [...prev, ...parsedFiles];
      });
    } catch {}
  }

  async function uploadTaskFiles() {
    const toUploadFiles = files.filter((file) => file.taskId === 'UPLOAD');
    if (toUploadFiles.length === 0) return;

    setIsPendingFiles(true);

    try {
      setIsPendingUploadFiles(true);
      const uploadedUrls = await uploadFiles(
        toUploadFiles.map(
          (file) => ({
            id: file.filename,
            url: file.url,
            extension: file.filename.split('.').pop() || '',
            source: MediaSource.Doc,
          }),
          false
        )
      );

      if (uploadedUrls.length === 0) {
        throw new Error('Não foi possível enviar os arquivos');
      }

      await uploadFileFn({
        files: uploadedUrls.map((url, index) => ({
          filename: toUploadFiles[index].filename,
          url,
          type: toUploadFiles[index].type,
        })),
        taskId: task.id,
      });

      Toast.show({
        type: 'success',
        text1: 'Arquivos enviados com sucesso!',
      });
      setIsPendingFiles(false);
    } catch (e: any) {
      console.error('ERRO-UPLOAD-FILES', e.message);
      if ('message' in e) {
        Toast.show({
          type: 'error',
          text1: 'Erro ao enviar arquivos',
          text2: e.message,
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Erro ao enviar arquivos',
          text2: 'Tente novamente mais tarde.',
        });
      }
    } finally {
      setIsPendingUploadFiles(false);
    }
  }

  const { mutateAsync: deleteFileFn, isPending: isPendingDeleteFile } =
    useMutation({
      mutationKey: ['deleteFile'],
      mutationFn: async (fileUrl: string) => {
        const response = await makeGraphQLRequest<DeleteFileMutation>({
          document: DELETE_FILE,
          variables: { taskId: task.id, fileUrl },
        });

        return response.deleteFile;
      },
    });

  async function deleteFile() {
    if (selectedFile?.taskId !== 'UPLOAD') {
      try {
        const data = await deleteFileFn(selectedFile?.url as string);
        if (!data.success) {
          Toast.show({
            type: 'error',
            text1: 'Erro ao apagar o arquivo',
            text2: data.message as string,
          });
          return;
        }
        Toast.show({
          type: 'success',
          text1: 'Arquivo apagado com sucesso!',
        });
      } catch (e: any) {
        console.log(e);
        if ('message' in e) {
          console.error('ERROR-DELETE-FILE:', e.message);
          Toast.show({
            type: 'error',
            text1: 'Erro ao apagar o arquivo',
            text2: e.message,
          });
          await queryClient.refetchQueries({ queryKey: ['getTask', task.id] });

          return;
        }
      }
      queryClient.setQueryData(
        ['getTask', task.id],
        (data: GetTaskQuery['getTask']) => {
          if (!data) return data;
          const remainingFiles = data.files.filter(
            (file) =>
              file.url !== selectedFile?.url && file.filename !== 'UPLOAD'
          );

          const stillCompleted = remainingFiles.length > 0;
          queryClient.setQueryData(
            ['taskMembers', task.id],
            (oldData: InfiniteData<GetTaskMembersQuery['getTaskMembers']>) => {
              if (!oldData) return oldData;

              return {
                pages: oldData.pages.map((page) =>
                  page.map((member) => {
                    if (member.user.id === user?.me.id) {
                      return {
                        ...member,
                        completed: stillCompleted,
                      };
                    }
                    return member;
                  })
                ),
                pageParams: oldData.pageParams,
              };
            }
          );

          return {
            ...data,
            completed: stillCompleted,
            completedCount: data.completedCount,
            files: remainingFiles,
          };
        }
      );

      await Promise.all([
        queryClient.refetchQueries({ queryKey: ['allAssignments'] }),
        queryClient.refetchQueries({ queryKey: ['getAllTasksByAssignmentId'] }),
        queryClient.refetchQueries({
          queryKey: ['getUserTasksByAssignmentId'],
        }),
      ]);
    }
    setFiles((prev) => prev.filter((file) => file.url !== selectedFile?.url));
    bottomSheetRef.current?.dismiss();
  }

  const saveAndroidFile = async (fileUri: string, fileName: string) => {
    try {
      const fileString = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      let dir = storage.getString('downloadDir');
      if (!dir) {
        dir = (await ScopedStorage.openDocumentTree(true)).uri;
        storage.set('downloadDir', dir);
      }

      await ScopedStorage.writeFile(
        dir,
        fileString,
        fileName,
        mime.getType(fileName) || 'application/octet-stream',
        'base64'
      );
      Toast.show({
        type: 'success',
        text1: 'Download concluído!',
      });
    } catch (err) {
      console.error('Erro ao salvar arquivo:', err);
      Toast.show({
        type: 'error',
        text1: 'Erro ao salvar arquivo',
        text2: 'Tente novamente mais tarde.',
      });
    }
  };

  async function handleDownloadFile() {
    if (!selectedFile) return;

    try {
      setIsDownloading(true);
      const fileUrl = createPath(selectedFile.url) as string;
      const downloadPath =
        (FileSystem.cacheDirectory ?? FileSystem.documentDirectory) +
        selectedFile.filename;
      const downloadResumable = FileSystem.createDownloadResumable(
        fileUrl,
        downloadPath,
        {
          headers: {
            Accept: 'application/octet-stream',
          },
        }
      );
      // @ts-expect-error - uri exists
      const { uri } = await downloadResumable.downloadAsync();
      if (Platform.OS === 'android') {
        await saveAndroidFile(uri, selectedFile.filename);
      } else {
        // save to ios
      }
      bottomSheetRef.current?.dismiss();
    } catch (error: any) {
      if ('response' in error) {
        if (error.response.status === 404) {
          Toast.show({
            type: 'error',
            text1: 'Arquivo não encontrado.',
            text2: 'Talvez o arquivo tenha sido apagado.',
          });
        } else {
          console.error('Erro ao baixar arquivo:', error);
          Toast.show({
            type: 'error',
            text1: 'Erro ao baixar arquivo',
            text2: 'Tente novamente mais tarde.',
          });
        }
        await queryClient.refetchQueries({
          queryKey: ['getTask', task.id],
        });
        return;
      }
      console.error('Erro ao baixar arquivo:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro ao baixar arquivo',
        text2: 'Tente novamente mais tarde.',
      });
    } finally {
      setIsDownloading(false);
    }
  }

  const assignment = queryClient.getQueryData<
    GetAssignmentByIdQuery['getAssignmentById']
  >(['getAssignment', task?.assignmentId]);

  const isPending =
    isPendingUploadFiles || isPendingUpload || isPendingUploadMutation;

  const openBottomSheet = (file: TaskFiles) => {
    if (isPending) {
      bottomSheetRef.current?.dismiss();
      return;
    }
    bottomSheetRef.current?.present();
    setSelectedFile(file);
  };

  return {
    navigation,
    bottomSheetRef,
    theme,
    formatDate,
    tagAsCompleted,
    handleDocuments,
    isPendingFiles,
    uploadFiles: uploadTaskFiles,
    files,
    scrollEnabled,
    handleScrollEnable,
    setSelectedFile,
    selectedFile,
    deleteFile,
    isPending,
    handleDownloadFile,
    assignment,
    user,
    isPendingTagAsCompleted,
    isPendingDeleteFile,
    isDownloading,
    openBottomSheet,
  };
}
