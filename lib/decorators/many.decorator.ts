import { Type } from '@nestjs/common';
import { TypeMetadataStorage, addFieldMetadata } from '@nestjs/graphql';
import { ClassType } from '@nestjs/graphql/dist/enums/class-type.enum';
import { LazyMetadataStorage } from '@nestjs/graphql/dist/schema-builder/storages/lazy-metadata.storage';
import { addClassTypeMetadata } from '@nestjs/graphql/dist/utils/add-class-type-metadata.util';
import { GraphQLInt } from 'graphql';

/**
 * Decorator for generate a entity with count type for a class.
 * It's used for automatically make the return type for findMany resolvers with count included.
 *
 * @example
 * If you have a User entity class, you can use this decorator to generate a (many) Users entity like this:
 *
 * ```typescript
 * ‍@Many(User)
 * export class Users {}
 * ```
 *
 * will generate:
 *
 * ```typescript
 * ‍@ObjectType()
 * export class Users {
 *   ‍@Field(() => [User])
 *   users: User[];
 *
 *   ‍@Field(() => GrahpQLInt)
 *   count: number;
 * }
 * ```
 *
 * @template T - The class type.
 * @param {Type<T>} classRef - The reference to the class.
 * @returns {ClassDecorator} - The decorator function.
 */
export function Many<T>(classRef: Type<T>, options?: ManyOptions): ClassDecorator {
  return (target) => {
    const metadata = {
      target,
      name: target.name,
      description: '',
      isAbstract: false
    };
    const addObjectTypeMetadata = () => TypeMetadataStorage.addObjectTypeMetadata(metadata);

    addObjectTypeMetadata();
    LazyMetadataStorage.store(addObjectTypeMetadata);

    addClassTypeMetadata(target, ClassType.OBJECT);

    const setName = options?.setName ? options.setName : classRef.name.toLowerCase() + 's';

    addFieldMetadata(() => [classRef], { nullable: true }, target.prototype, setName);
    addFieldMetadata(() => GraphQLInt, { defaultValue: 0 }, target.prototype, 'count');
  };
}

export type ManyOptions = {
  setName?: string;
};
