import { useQuery, useQueryClient } from '@tanstack/react-query';
import { makeGraphQLRequest } from '../../lib/graphQLClient';
import { GET_PROFILE } from '../../services/users/query/getProfile';
import { GetUserProfileQuery } from '../../__generated__/graphql';
import { useScreenTransition } from '../../hooks/useScreenTransition';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

export function useProfile(userId: string) {
  const { transitionFinished } = useScreenTransition();
  const queryClient = useQueryClient();
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      try {
        const { getUserProfile: data } =
          await makeGraphQLRequest<GetUserProfileQuery>({
            document: GET_PROFILE,
            variables: {
              id: userId,
            },
          });
        return data;
      } catch (e) {
        console.log('profile error:', e);
      }
    },
  });

  function onTabChanged(type: 'POSTS' | 'LIKES' | 'MEDIAS') {
    queryClient.refetchQueries({
      queryKey: ['profile', type.toLowerCase(), userId],
    });
  }

  useFocusEffect(
    useCallback(() => {
      refetch();
      queryClient.refetchQueries({ queryKey: ['profile', 'posts', userId] });
      queryClient.refetchQueries({ queryKey: ['profile', 'likes', userId] });
      queryClient.refetchQueries({ queryKey: ['profile', 'medias', userId] });
      return () => {};
    }, [refetch])
  );

  return {
    data,
    isLoading: !transitionFinished || isLoading,
    refetch,
    onTabChanged,
  };
}
