import { Field, InputType } from '@nestjs/graphql';

import { GraphQLInt } from 'graphql';
import { Min } from 'class-validator';

@InputType({ description: 'Pagination generic input' })
export class PaginationInput {
  @Field(() => GraphQLInt, { description: 'The page number' })
  @Min(1)
  page: number;

  @Field(() => GraphQLInt, { description: 'The number of items per page' })
  @Min(1)
  count: number;
}
