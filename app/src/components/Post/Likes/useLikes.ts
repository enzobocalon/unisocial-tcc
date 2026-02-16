import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { GET_LIKES } from '../../../services/posts/queries/getLikes';
import { useEffect, useState } from 'react';
import { useTheme } from 'styled-components';
import { PAGE_SIZE } from '../../../lib/constants';
import { graphQLClient } from '../../../lib/graphQLClient';
import { BottomTabProps, StackProps } from '../../../types/Navigation';
import { useNavigation } from '@react-navigation/native';

export function useLikes(postId: string) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [page, setPage] = useState(0);
  const [initialQueryCompleted, setInitialQueryCompleted] = useState(false);
  const theme = useTheme();
  const navigation = useNavigation<StackProps & BottomTabProps>();
  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['getLikeByPostId', { postId, page }],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      try {
        const response = await graphQLClient.request({
          document: GET_LIKES,
          variables: {
            postId: postId,
            page: page,
          },
        });
        if (
          !response.getLikeByPostId.like.length ||
          response.getLikeByPostId.like.length < PAGE_SIZE
        ) {
          setHasMoreData(false);
        }
        setInitialQueryCompleted(true);
        return response.getLikeByPostId;
      } catch (e) {
        console.log(e);
        setHasMoreData(false);
      }
    },

    enabled: isOpen && hasMoreData,
  });

  useEffect(() => {
    if (isOpen) {
      refetch();
    }
  }, [isOpen, refetch]);

  return {
    data: data?.like || [],
    dataCount: data?.count,
    isOpen,
    setIsOpen,
    loading: isLoading || isRefetching,
    page,
    setPage,
    hasMoreData,
    theme,
    initialQueryCompleted,
    navigation,
  };
}
