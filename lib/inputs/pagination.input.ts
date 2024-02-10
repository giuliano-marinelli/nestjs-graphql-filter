import { Field, InputType } from '@nestjs/graphql';

import { GraphQLInt } from 'graphql';
import { Min } from 'class-validator';

@InputType()
export class PaginationInput {
  @Field(() => GraphQLInt)
  @Min(1)
  page: number;

  @Field(() => GraphQLInt)
  @Min(1)
  count: number;
}
