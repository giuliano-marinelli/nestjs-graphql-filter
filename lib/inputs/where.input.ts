import { Field, InputType } from '@nestjs/graphql';

import { GraphQLFloat, GraphQLInt } from 'graphql';

@InputType()
export class StringWhereInput {
  @Field({ nullable: true })
  eq: string;

  @Field({ nullable: true })
  ne: string;

  @Field({ nullable: true })
  like: string;

  @Field({ nullable: true })
  ilike: string;

  @Field(() => [String], { nullable: true })
  in: string[];

  @Field(() => [String], { nullable: true })
  any: string[];

  @Field(() => [StringWhereInput], { nullable: true })
  and: StringWhereInput[];

  @Field(() => [StringWhereInput], { nullable: true })
  or: StringWhereInput[];

  @Field(() => StringWhereInput, { nullable: true })
  not: StringWhereInput;
}

@InputType()
export class IntWhereInput {
  @Field(() => GraphQLInt, { nullable: true })
  eq: number;

  @Field(() => GraphQLInt, { nullable: true })
  ne: number;

  @Field(() => GraphQLInt, { nullable: true })
  gt: number;

  @Field(() => GraphQLInt, { nullable: true })
  gte: number;

  @Field(() => GraphQLInt, { nullable: true })
  lt: number;

  @Field(() => GraphQLInt, { nullable: true })
  lte: number;

  @Field(() => [GraphQLInt], { nullable: true })
  in: number[];

  @Field(() => [GraphQLInt], { nullable: true })
  any: number[];

  @Field(() => [GraphQLInt, GraphQLInt], { nullable: true })
  between: [number, number];

  @Field(() => [IntWhereInput], { nullable: true })
  and: IntWhereInput[];

  @Field(() => [IntWhereInput], { nullable: true })
  or: IntWhereInput[];

  @Field(() => IntWhereInput, { nullable: true })
  not: IntWhereInput;
}

@InputType()
export class FloatWhereInput {
  @Field(() => GraphQLFloat, { nullable: true })
  eq: number;

  @Field(() => GraphQLFloat, { nullable: true })
  ne: number;

  @Field(() => GraphQLFloat, { nullable: true })
  gt: number;

  @Field(() => GraphQLFloat, { nullable: true })
  gte: number;

  @Field(() => GraphQLFloat, { nullable: true })
  lt: number;

  @Field(() => GraphQLFloat, { nullable: true })
  lte: number;

  @Field(() => [GraphQLFloat], { nullable: true })
  in: number[];

  @Field(() => [GraphQLFloat], { nullable: true })
  any: number[];

  @Field(() => [GraphQLFloat, GraphQLFloat], { nullable: true })
  between: [number, number];

  @Field(() => [FloatWhereInput], { nullable: true })
  and: FloatWhereInput[];

  @Field(() => [FloatWhereInput], { nullable: true })
  or: FloatWhereInput[];

  @Field(() => FloatWhereInput, { nullable: true })
  not: FloatWhereInput;
}

@InputType()
export class DateTimeWhereInput {
  @Field(() => Date, { nullable: true })
  eq: Date;

  @Field(() => Date, { nullable: true })
  ne: Date;

  @Field(() => Date, { nullable: true })
  gt: Date;

  @Field(() => Date, { nullable: true })
  gte: Date;

  @Field(() => Date, { nullable: true })
  lt: Date;

  @Field(() => Date, { nullable: true })
  lte: Date;

  @Field(() => [Date], { nullable: true })
  in: Date[];

  @Field(() => [Date], { nullable: true })
  any: Date[];

  @Field(() => [Date, Date], { nullable: true })
  between: [Date, Date];

  @Field(() => [DateTimeWhereInput], { nullable: true })
  and: DateTimeWhereInput[];

  @Field(() => [DateTimeWhereInput], { nullable: true })
  or: DateTimeWhereInput[];

  @Field(() => DateTimeWhereInput, { nullable: true })
  not: DateTimeWhereInput;
}

@InputType()
export class BooleanWhereInput {
  @Field({ nullable: true })
  eq: boolean;

  @Field({ nullable: true })
  ne: boolean;

  @Field(() => [BooleanWhereInput], { nullable: true })
  and: BooleanWhereInput[];

  @Field(() => [BooleanWhereInput], { nullable: true })
  or: BooleanWhereInput[];

  @Field(() => BooleanWhereInput, { nullable: true })
  not: BooleanWhereInput;
}
