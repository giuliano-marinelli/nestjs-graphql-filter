import { Type } from '@nestjs/common';
import { TypeMetadataStorage, addFieldMetadata } from '@nestjs/graphql';
import { ClassType } from '@nestjs/graphql/dist/enums/class-type.enum';
import { LazyMetadataStorage } from '@nestjs/graphql/dist/schema-builder/storages/lazy-metadata.storage';
import { addClassTypeMetadata } from '@nestjs/graphql/dist/utils/add-class-type-metadata.util';
import { FilterFields } from './metadata';

export function FilterOrderType<T>(classRef: Type<T>): ClassDecorator {
  return (target) => {
    const metadata = {
      target,
      name: target.name,
      description: '',
      isAbstract: false
    };
    LazyMetadataStorage.store(() => TypeMetadataStorage.addInputTypeMetadata(metadata));
    addClassTypeMetadata(target, ClassType.INPUT);
    FilterFields[classRef.name]?.forEach((field) => {
      addFieldMetadata(field.orderTypeFunc, field.options, target.prototype, field.propertyKey);
    });
  };
}
