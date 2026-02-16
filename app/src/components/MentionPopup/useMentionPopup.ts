import { useQuery } from '@tanstack/react-query';
import { makeGraphQLRequest } from '../../lib/graphQLClient';
import { GetMentionableUsersQuery } from '../../__generated__/graphql';
import { GET_MENTIONABLE_USERS } from '../../services/mentions/queries/getMentionableUsers';

export function useMentionPopup(text: string) {
  const { data, isLoading } = useQuery({
    queryKey: ['getMentionableUsers', text],
    queryFn: async () => {
      const { getMentionableUsers: data } =
        await makeGraphQLRequest<GetMentionableUsersQuery>({
          document: GET_MENTIONABLE_USERS,
          variables: {
            content: text,
          },
        });
      data.push({
        id: 'INFO',
        name: 'INFO',
        username: 'INFO',
        avatar: null,
      });
      return data;
    },
    staleTime: 0,
    enabled: !!text,
  });

  return {
    data: data || [],
    loading: isLoading,
  };
}
