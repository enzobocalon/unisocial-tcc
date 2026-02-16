import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { PAGE_SIZE } from '../../lib/constants';
import { makeGraphQLRequest } from '../../lib/graphQLClient';
import { GET_ALL_FILES } from '../../services/assignments/queries/getAllFiles';
import {
  DeleteFileMutation,
  FileUser,
  GetAllFilesByTaskIdQuery,
  GetAssignmentByIdQuery,
  GetTaskQuery,
  SearchFilesByUserMutation,
} from '../../__generated__/graphql';
import { useTheme } from 'styled-components';
import { useCallback, useEffect, useRef, useState } from 'react';
import { SEARCH_FILES } from '../../services/assignments/mutations/searchFilesByUser';
import { useDebounce } from '../../hooks/useDebounce';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useAuth } from '../../context/AuthContext';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import Toast from 'react-native-toast-message';
import { createPath } from '../../utils/path';
import { DELETE_FILE } from '../../services/assignments/mutations/deleteFile';
import { storage } from '../../lib/storage';
import * as ScopedStorage from 'react-native-scoped-storage';
import mime from 'mime';
import { useRefetchOnAppFocus } from '../../hooks/useRefetchOnAppFocus';

type File = {
  filename: string;
  url: string;
  type: string;
  id: string;
};

export function useFiles(taskId: string, assignmentId: string) {
  const theme = useTheme();
  const [hasMoreSearchPages, setHasMoreSearchPages] = useState(true);
  const [searchVal, setSearchVal] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchPage, setSearchPage] = useState(0);
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [data, setData] = useState<
    GetAllFilesByTaskIdQuery['getAllFilesByTaskId']
  >([]);
  const { user } = useAuth();
  const [selectedItem, setSelectedItem] = useState<{
    user: FileUser;
    file: File;
  } | null>(null);
  const queryClient = useQueryClient();
  const [isDownloading, setIsDownloading] = useState(false);

  const {
    data: queryData,
    hasNextPage,
    fetchNextPage,
    isLoading,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['getAllFiles', taskId],
    queryFn: async ({ pageParam }) => {
      const data = await makeGraphQLRequest<GetAllFilesByTaskIdQuery>({
        document: GET_ALL_FILES,
        variables: {
          taskId,
          page: pageParam,
        },
      });
      setData((prev) =>
        pageParam === 0
          ? data.getAllFilesByTaskId
          : [...prev, ...data.getAllFilesByTaskId]
      );
      return data.getAllFilesByTaskId;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, page) => {
      if (!lastPage || !lastPage.length || lastPage.length < PAGE_SIZE) {
        return undefined;
      }
      return page.length;
    },
  });

  async function onRefresh() {
    await refetch();
    setRefreshing(false);
  }

  const handleSelectItem = (user: FileUser, file: File) => {
    setSelectedItem({ user, file });
    bottomSheetRef.current?.present();
  };

  const { mutateAsync: searchFn } = useMutation({
    mutationFn: async ({ query, page }: { query: string; page: number }) => {
      const data = await makeGraphQLRequest<SearchFilesByUserMutation>({
        document: SEARCH_FILES,
        variables: {
          taskId,
          query,
          page,
        },
      });
      return data.searchFilesByUser;
    },
  });

  const handleSearch = useCallback(
    async (query: string, page: number = 0) => {
      if (query === '') {
        if (queryData?.pages) {
          const originalData = queryData.pages.flat();
          setData(originalData);
        } else {
          await refetch();
        }
        setSearchPage(0);
        setHasMoreSearchPages(true);
        return;
      }

      const search = await searchFn({ query, page });

      if (page === 0) {
        setData(search);
      } else {
        setData((prev) => [...prev, ...search]);
      }

      setHasMoreSearchPages(search!.length === PAGE_SIZE);
      setSearchPage(page);
    },
    [searchFn, refetch]
  );

  const debouncedValue = useDebounce(searchVal, 500);

  useEffect(() => {
    if (debouncedValue !== null) {
      handleSearch(debouncedValue, 0);
    }
  }, [debouncedValue]);

  const assignment = queryClient.getQueryData<
    GetAssignmentByIdQuery['getAssignmentById']
  >(['getAssignment', assignmentId]);

  const task = queryClient.getQueryData<GetTaskQuery['getTask']>([
    'getTask',
    taskId,
  ]);

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
    if (!selectedItem) return;

    try {
      setIsDownloading(true);
      const fileUrl = createPath(selectedItem.file.url) as string;
      const downloadPath =
        (FileSystem.cacheDirectory ?? FileSystem.documentDirectory) +
        selectedItem.file.filename;
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
        await saveAndroidFile(uri, selectedItem.file.filename);
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
        await Promise.all([
          queryClient.refetchQueries({
            queryKey: ['getAllFiles', taskId],
          }),
          queryClient.refetchQueries({
            queryKey: ['getTask', taskId],
          }),
        ]);

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

  const { mutateAsync: deleteFileFn, isPending: isPendingDelete } = useMutation(
    {
      mutationKey: ['deleteFile'],
      mutationFn: async (fileUrl: string) => {
        const response = await makeGraphQLRequest<DeleteFileMutation>({
          document: DELETE_FILE,
          variables: { taskId, fileUrl },
        });

        return response.deleteFile;
      },
    }
  );

  async function deleteFile() {
    try {
      if (!selectedItem) return;
      const data = await deleteFileFn(selectedItem?.file.url as string);
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
        return;
      }
    }
    if (selectedItem?.user.user.id === user?.me.id) {
      await queryClient.refetchQueries({
        queryKey: ['getTask', taskId],
      });
    }

    queryClient.setQueryData(
      ['getAllFiles', taskId],
      (prev: InfiniteData<GetAllFilesByTaskIdQuery['getAllFilesByTaskId']>) => {
        if (!prev) return prev;

        return {
          ...prev,
          pages: prev.pages
            .map((page) =>
              page
                .map((task) => ({
                  ...task,
                  files: task.files.filter(
                    (file) => file.url !== selectedItem?.file.url
                  ),
                }))
                .filter((task) => task.files.length > 0)
            )
            .filter((page) => page.length > 0),
        };
      }
    );

    setData((prev) => {
      return prev
        .map((item) => ({
          ...item,
          files: item.files.filter(
            (file) => file.url !== selectedItem?.file.url
          ),
        }))
        .filter((item) => item.files.length > 0);
    });

    bottomSheetRef.current?.dismiss();
  }

  useRefetchOnAppFocus([
    ['getAssignment', assignmentId],
    ['getAssignmentUsers', assignmentId],
    ['getUserTasksByAssignmentId', { assignmentId }],
    ['getAllTasksByAssignmentId', { assignmentId }],
    ['getTask', taskId],
    ['getAllFiles', taskId],
  ]);

  return {
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
    assignment,
    task,
    user,
    handleDownloadFile,
    deleteFile,
    isPendingDelete,
    isDownloading,
  };
}
