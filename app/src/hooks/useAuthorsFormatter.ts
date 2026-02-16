import { BaseUser } from '../__generated__/graphql';
import { useAuth } from '../context/AuthContext';

export function useAuthorsFormatter() {
  const { user } = useAuth();
  function getAuthors(authors: BaseUser[]): string {
    return authors
      ?.map((author, index) => {
        if (index === 1) {
          return `${authors.length > 2 ? ', ' : ' e '}${author.id === user?.me.id ? 'você' : author.name}`;
        }
        if (index === 2) {
          return ` e outros ${authors.length - 2}`;
        }
        return author.id === user?.me.id ? 'Você' : author.name;
      })
      .join('');
  }
  return {
    getAuthors,
  };
}
