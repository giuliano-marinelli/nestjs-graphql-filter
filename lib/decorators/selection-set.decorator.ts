import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { SelectionInput } from '../types/selection-set';

/**
 * Options for the SelectionInput decorator.
 * @property root - The root parameter of the selection set from where make the SelectionInput.
 */
export type SelectionInputOptions = {
  root?: string;
};

/**
 * Decorator that extracts the selection set from the GraphQL execution context.
 *
 * @param data - The options for the SelectionInput decorator. For example: { root: 'set' }
 * @returns A new SelectionInput instance containing the selection set.
 */
export const SelectionSet = createParamDecorator((data: SelectionInputOptions, execContext: ExecutionContext) => {
  const context = GqlExecutionContext.create(execContext);
  const info = context.getInfo();
  return new SelectionInput(info, data);
});
