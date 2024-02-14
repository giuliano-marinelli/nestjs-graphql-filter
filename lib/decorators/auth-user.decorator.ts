import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

/**
 * Decorator that extracts the AuthUser from the GraphQL execution context request.
 *
 * @param data - The name of the parameter to extract from the AuthUser.
 * @param execContext - The execution context of the GraphQL resolver.
 * @returns The AuthUser from the GraphQL execution context (if available)
 */
export const AuthUser = createParamDecorator((data: unknown, execContext: ExecutionContext) => {
  const context = GqlExecutionContext?.create(execContext);
  const request = context?.getContext()?.req;

  return request ? request[data ? (data as string) : 'user'] : null;
});
