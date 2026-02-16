import { useMutation } from '@tanstack/react-query';
import { makeGraphQLRequest } from '../lib/graphQLClient';
import { GENERATE_PRESIGNED_URL } from '../services/uploads/mutations/generatePresignedUrl';
import {
  GeneratePresignedUrlsMutation,
  MediaSource,
  PresignedUrl,
  UrlRequestDto,
} from '../__generated__/graphql';
import { checkMediaFormat } from '../utils/checkMediaFormat';
import { uriToBlob } from '../lib/constants';
import Toast from 'react-native-toast-message';
import { getMimeType } from '../utils/getMimeType';

export type MediaItem = {
  id: string;
  extension: string;
  url: string;
  source: MediaSource;
};

export function useUpload() {
  const { mutateAsync: getPresignedUrls, isPending: isPendingUrls } =
    useMutation({
      mutationFn: async (data: UrlRequestDto[]) => {
        const mutationData =
          await makeGraphQLRequest<GeneratePresignedUrlsMutation>({
            document: GENERATE_PRESIGNED_URL,
            variables: { data },
          });
        return mutationData.generatePresignedUrls;
      },
    });

  const { mutateAsync: uploadFile, isPending: isPendingUpload } = useMutation({
    mutationFn: async ({
      signedUrl,
      blob,
    }: {
      signedUrl: PresignedUrl;
      blob: Blob;
    }) => {
      const res = await fetch(signedUrl.uploadUrl, {
        method: 'PUT',
        body: blob,
        headers: { 'Content-Type': signedUrl.type },
      });
      return res;
    },
  });

  const uploadFiles = async (
    files: MediaItem[],
    showErrorToast = true
  ): Promise<string[]> => {
    if (!files.length) return [];

    files = files.map((file) => {
      const ext = file.extension ? `.${file.extension}` : '';
      // verifica se o id já termina com a extensão
      const finalId =
        file.id.endsWith(ext) || !ext ? file.id : `${file.id}${ext}`;

      return {
        ...file,
        id: finalId,
      };
    });

    try {
      const urlRequest: UrlRequestDto[] = files.map((item) => ({
        name: item.id,
        type: getMimeType(item.id),
        source: item.source || MediaSource.Default,
      }));
      const signedUrls = await getPresignedUrls(urlRequest);
      const uploadedUrls: string[] = [];

      await Promise.all(
        files.map(async (file) => {
          const signed = signedUrls.find((s) => s.filename === file.id);
          if (!signed) return;

          const blob = await uriToBlob(file.url);
          await uploadFile({ signedUrl: signed, blob });

          uploadedUrls.push(signed.fileUrl);
        })
      );
      return uploadedUrls;
    } catch (e: any) {
      console.error('Erro ao enviar arquivos', e);
      if (showErrorToast) {
        if ('message' in e) {
          Toast.show({
            type: 'error',
            text1: 'Erro ao enviar os seus arquivos.',
            text2: e.message,
          });
        } else {
          Toast.show({
            type: 'error',
            text1: 'Erro ao enviar os seus arquivos.',
            text2: 'Tente novamente mais tarde.',
          });
        }
      }
      throw e;
    }
  };

  return {
    uploadFiles,
    isPending: isPendingUpload || isPendingUrls,
  };
}
