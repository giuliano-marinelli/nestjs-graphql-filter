import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { SelectionInput } from '../types/selection-set';

/**
 * Decorator that extracts the selection set from the GraphQL execution context.
 *
 * @param data - Additional data passed to the decorator (unused in this implementation).
 * @param execContext - The execution context of the GraphQL resolver.
 * @returns A new SelectionInput instance containing the selection set.
 */
export const SelectionSet = createParamDecorator((data: unknown, execContext: ExecutionContext) => {
  const context = GqlExecutionContext.create(execContext);
  const info = context.getInfo();
  return new SelectionInput(info);
});
