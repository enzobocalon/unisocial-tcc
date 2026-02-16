import {
  Catch,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';

@Catch()
export class HttpExceptionFilter implements GqlExceptionFilter {
  async catch(exception: Error, context: ExecutionContext) {
    const isHTTPRequest = context.getType() === 'http';

    if (isHTTPRequest) {
      const response = context.switchToHttp().getResponse();
      const status =
        exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;

      const errorResponse = {
        statusCode: status,
        message:
          exception instanceof HttpException
            ? exception.getResponse() // Safeguard against non-HttpException errors
            : 'Internal Server Error',
      };
      return response.status(status).json(errorResponse);
    }

    // @ts-expect-error GraphQL context is not included in the ExecutionContext type
    const isGraphQLError = context.getType() === 'graphql';
    if (isGraphQLError) {
      throw exception;
    }

    const gqlError = new GraphQLError(
      exception.message || 'Internal Server Error',
      undefined,
      undefined,
      undefined,
      undefined,
      exception, // Attach the original error as an extension
      {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
      },
    );

    return gqlError;
  }
}
