import { GraphQLClient, RequestOptions } from 'graphql-request';
import { env } from './env';
import { storage } from './storage';
import { GQLErrors } from './errors';

export const graphQLClient = new GraphQLClient(env.API_URL, {
  headers: {
    authorization: `Bearer ${storage.getString('token')}`,
  },
});

// timeout helper
export async function makeGraphQLRequestWithTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number = 4000
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Request timed out')), timeoutMs)
    ),
  ]);
}

interface GraphQLErrorResponse {
  response: {
    errors: {
      code: string;
      message: string;
    }[];
  };
}

export const makeGraphQLRequest = async <T>(
  request: RequestOptions
): Promise<T> => {
  try {
    graphQLClient.setHeader(
      'authorization',
      `Bearer ${storage.getString('token')}`
    );
    return await graphQLClient.request<T>(request);
  } catch (e) {
    console.log('erro ao realizar a requisição', e);
    if (!isGraphQLErrorResponse(e)) throw e;
    throw new GQLErrors(e);
  }
};

export function isGraphQLErrorResponse(
  error: unknown
): error is GraphQLErrorResponse {
  if (typeof error === 'object' && error !== null) {
    return true;
  }
  return false;
}
