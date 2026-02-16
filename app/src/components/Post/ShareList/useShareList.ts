import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { makeGraphQLRequest } from '../../../lib/graphQLClient';
import { GET_SHARES } from '../../../services/posts/queries/getShares';
import { GetShareByPostIdQuery } from '../../../__generated__/graphql';
import { PAGE_SIZE } from '../../../lib/constants';

export function useShareList(postId: string) {
  const [page, setPage] = useState(0);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [initialQueryCompleted, setInitialQueryCompleted] = useState(false);
  const { data, refetch } = useQuery({
    queryKey: ['shareList', { postId, page }],
    queryFn: async () => {
      try {
        const { getShareByPostId: data } =
          await makeGraphQLRequest<GetShareByPostIdQuery>({
            document: GET_SHARES,
            variables: { postId: postId, page: page },
          });
        if (!data.share.length || data.share.length < PAGE_SIZE) {
          setHasMoreData(false);
        }
        setInitialQueryCompleted(true);
        return data;
      } catch (e) {
        console.log(e);
        setHasMoreData(false);
      }
    },
  });

  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    data: data?.share || [],
    count: data?.count,
    hasMoreData,
    initialQueryCompleted,
    page,
    setPage,
  };
}
