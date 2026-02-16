import {
  ExecutionContext,
  UnauthorizedException,
  createParamDecorator,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

/**
 * Extract user ID from the request context. This decorator can be used in both REST and GraphQL requests.
 *
 * @param {string} [type='graphql'] - The type of the request ('graphql' or 'rest'). Defaults to 'graphql'.
 * @returns {string} - The user ID extracted from the request context.
 * @throws {UnauthorizedException} - Throws an exception if the user ID is not present in the request.
 */
export const ActiveUserId = createParamDecorator<
  'rest' | 'graphql' | undefined,
  ExecutionContext
>((data, context: ExecutionContext) => {
  const type = data || 'graphql'; // Default to 'graphql' if type is not provided

  if (type === 'graphql') {
    const gqlContext = GqlExecutionContext.create(context);
    const request = gqlContext.getContext().req;
    const userId = request.userId;

    if (!userId) {
      throw new UnauthorizedException();
    }

    return userId;
  } else if (type === 'rest') {
    const request = context.switchToHttp().getRequest();
    const userId = request.userId;

    if (!userId) {
      throw new UnauthorizedException();
    }

    return userId;
  } else {
    throw new Error(`Unsupported request type: ${type}`);
  }
});
