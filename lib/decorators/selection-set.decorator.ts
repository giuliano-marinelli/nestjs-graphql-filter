import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { SelectionInput } from '../types/selection-set';

export const SelectionSet = createParamDecorator((data: unknown, execContext: ExecutionContext) => {
  const context = GqlExecutionContext.create(execContext);
  const info = context.getInfo();
  return new SelectionInput(info.fieldNodes[0]?.selectionSet?.selections);
});
