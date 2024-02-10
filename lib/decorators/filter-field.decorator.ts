import { FieldOptions, GqlTypeReference, ReturnTypeFunc, ReturnTypeFuncValue } from '@nestjs/graphql';

import { BooleanWhereInput, DateTimeWhereInput, IntWhereInput, StringWhereInput } from '../inputs/where.input';
import { FilterFields } from './metadata';

type FieldOptionsExtractor<T> = T extends [GqlTypeReference<infer P>]
  ? FieldOptions<P[]>
  : T extends GqlTypeReference<infer P>
  ? FieldOptions<P>
  : never;

export function FilterField(): PropertyDecorator;
export function FilterField<T extends ReturnTypeFuncValue>(options: FieldOptionsExtractor<T>): PropertyDecorator;
export function FilterField<T extends ReturnTypeFuncValue>(
  returnTypeFunction?: ReturnTypeFunc<T>,
  options?: FieldOptionsExtractor<T>
): PropertyDecorator;
export function FilterField<T extends ReturnTypeFuncValue>(
  typeOrOptions?: ReturnTypeFunc<T> | FieldOptionsExtractor<T>,
  fieldOptions?: FieldOptionsExtractor<T>
): PropertyDecorator {
  return (target, propertyKey) => {
    let [typeFunc, options] =
      typeof typeOrOptions === 'function' ? [typeOrOptions, fieldOptions] : [undefined, typeOrOptions as any];

    // get the type of the property for use if no type is provided
    const propertyType = Reflect.getMetadata('design:type', target, propertyKey).name;
    if (!typeFunc) {
      switch (propertyType) {
        case 'Number':
          typeFunc = () => IntWhereInput as T;
          break;
        case 'Boolean':
          typeFunc = () => BooleanWhereInput as T;
          break;
        case 'Date':
          typeFunc = () => DateTimeWhereInput as T;
          break;
        case 'String':
        default:
          typeFunc = () => StringWhereInput as T;
          break;
      }
    }

    if (!options) options = { nullable: true };

    if (!FilterFields[target.constructor.name]) FilterFields[target.constructor.name] = [];
    FilterFields[target.constructor.name].push({ typeFunc, options, propertyKey });
  };
}
