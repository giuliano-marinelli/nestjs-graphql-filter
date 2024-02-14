import { Field, InputType } from '@nestjs/graphql';

import { GraphQLFloat, GraphQLInt } from 'graphql';

@InputType({ description: 'Where input for string type' })
export class StringWhereInput {
  @Field({ nullable: true, description: 'Equal to' })
  eq: string;

  @Field({ nullable: true, description: 'Not equal to' })
  ne: string;

  @Field({ nullable: true, description: 'Pattern matching expression' })
  like: string;

  @Field({ nullable: true, description: 'Case-sensitive pattern matching expression' })
  ilike: string;

  @Field(() => [String], { nullable: true, description: 'Equal to anything in the list' })
  in: string[];

  @Field(() => [String], { nullable: true, description: 'Equal to anything in the list' })
  any: string[];

  @Field(() => [StringWhereInput], { nullable: true, description: 'List of AND conditions' })
  and: StringWhereInput[];

  @Field(() => [StringWhereInput], { nullable: true, description: 'List of OR conditions' })
  or: StringWhereInput[];

  @Field(() => StringWhereInput, { nullable: true, description: 'Negated condition' })
  not: StringWhereInput;
}

@InputType({ description: 'Where input for integer type' })
export class IntWhereInput {
  @Field(() => GraphQLInt, { nullable: true, description: 'Equal to' })
  eq: number;

  @Field(() => GraphQLInt, { nullable: true, description: 'Not equal to' })
  ne: number;

  @Field(() => GraphQLInt, { nullable: true, description: 'Greater than' })
  gt: number;

  @Field(() => GraphQLInt, { nullable: true, description: 'Greater than or equal to' })
  gte: number;

  @Field(() => GraphQLInt, { nullable: true, description: 'Less than' })
  lt: number;

  @Field(() => GraphQLInt, { nullable: true, description: 'Less than or equal to' })
  lte: number;

  @Field(() => [GraphQLInt], { nullable: true, description: 'Equal to anything in the list' })
  in: number[];

  @Field(() => [GraphQLInt], { nullable: true, description: 'Equal to anything in the list' })
  any: number[];

  @Field(() => [GraphQLInt, GraphQLInt], { nullable: true, description: 'Value is between two values' })
  between: [number, number];

  @Field(() => [IntWhereInput], { nullable: true, description: 'List of AND conditions' })
  and: IntWhereInput[];

  @Field(() => [IntWhereInput], { nullable: true, description: 'List of OR conditions' })
  or: IntWhereInput[];

  @Field(() => IntWhereInput, { nullable: true, description: 'Negated condition' })
  not: IntWhereInput;
}

@InputType({ description: 'Where input for float type' })
export class FloatWhereInput {
  @Field(() => GraphQLFloat, { nullable: true, description: 'Equal to' })
  eq: number;

  @Field(() => GraphQLFloat, { nullable: true, description: 'Not equal to' })
  ne: number;

  @Field(() => GraphQLFloat, { nullable: true, description: 'Greater than' })
  gt: number;

  @Field(() => GraphQLFloat, { nullable: true, description: 'Greater than or equal to' })
  gte: number;

  @Field(() => GraphQLFloat, { nullable: true, description: 'Less than' })
  lt: number;

  @Field(() => GraphQLFloat, { nullable: true, description: 'Less than or equal to' })
  lte: number;

  @Field(() => [GraphQLFloat], { nullable: true, description: 'Equal to anything in the list' })
  in: number[];

  @Field(() => [GraphQLFloat], { nullable: true, description: 'Equal to anything in the list' })
  any: number[];

  @Field(() => [GraphQLFloat, GraphQLFloat], { nullable: true, description: 'Value is between two values' })
  between: [number, number];

  @Field(() => [FloatWhereInput], { nullable: true, description: 'List of AND conditions' })
  and: FloatWhereInput[];

  @Field(() => [FloatWhereInput], { nullable: true, description: 'List of OR conditions' })
  or: FloatWhereInput[];

  @Field(() => FloatWhereInput, { nullable: true, description: 'Negated condition' })
  not: FloatWhereInput;
}

@InputType({ description: 'Where input for date type' })
export class DateTimeWhereInput {
  @Field(() => Date, { nullable: true, description: 'Equal to' })
  eq: Date;

  @Field(() => Date, { nullable: true, description: 'Not equal to' })
  ne: Date;

  @Field(() => Date, { nullable: true, description: 'Greater than' })
  gt: Date;

  @Field(() => Date, { nullable: true, description: 'Greater than or equal to' })
  gte: Date;

  @Field(() => Date, { nullable: true, description: 'Less than' })
  lt: Date;

  @Field(() => Date, { nullable: true, description: 'Less than or equal to' })
  lte: Date;

  @Field(() => [Date], { nullable: true, description: 'Equal to anything in the list' })
  in: Date[];

  @Field(() => [Date], { nullable: true, description: 'Equal to anything in the list' })
  any: Date[];

  @Field(() => [Date, Date], { nullable: true, description: 'Value is between two values' })
  between: [Date, Date];

  @Field(() => [DateTimeWhereInput], { nullable: true, description: 'List of AND conditions' })
  and: DateTimeWhereInput[];

  @Field(() => [DateTimeWhereInput], { nullable: true, description: 'List of OR conditions' })
  or: DateTimeWhereInput[];

  @Field(() => DateTimeWhereInput, { nullable: true, description: 'Negated condition' })
  not: DateTimeWhereInput;
}

@InputType({ description: 'Where input for boolean type' })
export class BooleanWhereInput {
  @Field({ nullable: true, description: 'Equal to' })
  eq: boolean;

  @Field({ nullable: true, description: 'Not equal to' })
  ne: boolean;

  @Field(() => [BooleanWhereInput], { nullable: true, description: 'List of AND conditions' })
  and: BooleanWhereInput[];

  @Field(() => [BooleanWhereInput], { nullable: true, description: 'List of OR conditions' })
  or: BooleanWhereInput[];

  @Field(() => BooleanWhereInput, { nullable: true, description: 'Negated condition' })
  not: BooleanWhereInput;
}
