import { useMemo } from 'react';
import { Actions, BaseUser } from '../../../__generated__/graphql';
import { useAuthorsFormatter } from '../../../hooks/useAuthorsFormatter';

export function useUserAction(actions: Actions[]) {
  const { getAuthors: hookGetAuthors } = useAuthorsFormatter();
  const authors = useMemo(() => {
    return actions?.map((action) => {
      const author = action.author as BaseUser;
      return {
        id: author.id,
        name: author.name,
        avatar: author.avatar,
      };
    });
  }, [actions]);

  const getAuthors = () => {
    return hookGetAuthors(authors as BaseUser[]);
  };

  function getActionType() {
    if (!actions) {
      return '';
    }
    switch (actions[0].type) {
      case 'LIKE':
        if (actions.length > 1) {
          return 'curtiram essa publicação';
        }
        return 'curtiu isso';
      case 'REPLY':
        if (actions.length > 1) {
          return 'responderam a essa publicação';
        }
        return 'respondeu a essa publicação';
      case 'SHARE':
        if (actions.length > 1) {
          return 'compartilharam essa publicação';
        }
        return 'compartilhou essa publicação';
      default:
        return '';
    }
  }

  return {
    authors,
    getActionType,
    getAuthors,
  };
}
