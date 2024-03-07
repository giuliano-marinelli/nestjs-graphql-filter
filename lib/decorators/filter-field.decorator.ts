import { FieldOptions, GqlTypeReference, ReturnTypeFunc, ReturnTypeFuncValue } from '@nestjs/graphql';

import { BooleanWhereInput, DateTimeWhereInput, IntWhereInput, StringWhereInput } from '../inputs/where.input';
import { FilterFields } from './metadata';
import { OrderDirection } from '../inputs/order.input';

type FieldOptionsExtractor<T> = T extends [GqlTypeReference<infer P>]
  ? FieldOptions<P[]>
  : T extends GqlTypeReference<infer P>
  ? FieldOptions<P>
  : never;

/**
 * Decorator that is used to add a field for the filter input type generation in GraphQL.
 *
 * @returns {PropertyDecorator} The decorator function.
 */
export function FilterField(): PropertyDecorator;
export function FilterField<T extends ReturnTypeFuncValue>(options: FieldOptionsExtractor<T>): PropertyDecorator;
export function FilterField<T extends ReturnTypeFuncValue>(
  whereReturnTypeFunction?: ReturnTypeFunc<T>,
  orderReturnTypeFunction?: ReturnTypeFunc<T>,
  options?: FieldOptionsExtractor<T>
): PropertyDecorator;
export function FilterField<T extends ReturnTypeFuncValue>(
  whereTypeOrOrderTypeOrOptions?: ReturnTypeFunc<T> | FieldOptionsExtractor<T>,
  orderTypeOrOptions?: ReturnTypeFunc<T> | FieldOptionsExtractor<T>,
  fieldOptions?: FieldOptionsExtractor<T>
): PropertyDecorator {
  return (target, propertyKey) => {
    let [whereTypeFunc, orderTypeFunc, options] =
      typeof orderTypeOrOptions === 'function'
        ? [whereTypeOrOrderTypeOrOptions, orderTypeOrOptions, fieldOptions]
        : typeof whereTypeOrOrderTypeOrOptions === 'function'
        ? [whereTypeOrOrderTypeOrOptions, undefined, orderTypeOrOptions as any]
        : [undefined, undefined, whereTypeOrOrderTypeOrOptions as any];

    // get the type of the property for use if no type is provided
    const propertyType = Reflect.getMetadata('design:type', target, propertyKey)?.name;
    if (!whereTypeFunc) {
      switch (propertyType) {
        case 'Number':
          whereTypeFunc = () => IntWhereInput as T;
          break;
        case 'Boolean':
          whereTypeFunc = () => BooleanWhereInput as T;
          break;
        case 'Date':
          whereTypeFunc = () => DateTimeWhereInput as T;
          break;
        case 'String':
        default:
          whereTypeFunc = () => StringWhereInput as T;
          break;
      }
    }
    if (!orderTypeFunc) {
      orderTypeFunc = () => OrderDirection as T;
    }

    if (!options) options = { nullable: true };

    if (!FilterFields[target.constructor.name]) FilterFields[target.constructor.name] = [];
    FilterFields[target.constructor.name].push({ whereTypeFunc, orderTypeFunc, options, propertyKey });
  };
}
