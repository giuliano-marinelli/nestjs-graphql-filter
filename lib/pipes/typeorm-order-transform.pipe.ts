import { PipeTransform } from '@nestjs/common';
import { FindOptionsOrder } from 'typeorm';

/**
 * Transforms the input value into a FindOptionsOrder object of TypeORM.
 * @template T - The type of the input value.
 */
export class TypeORMOrderTransform<T> implements PipeTransform {
  transform(value: T) {
    return transformTypeORMOrder(value) as FindOptionsOrder<T>;
  }
}

const transformTypeORMOrder = (order: any): any => {
  const TypeORMOrder: any = {};

  if (!order) return {};

  if (Array.isArray(order)) {
    order.forEach((orderPart) => {
      Object.keys(orderPart)?.forEach((field) => {
        TypeORMOrder[field] = orderPart[field];
      });
    });
  } else {
    Object.keys(order)?.forEach((field) => {
      TypeORMOrder[field] = order[field];
    });
  }

  return TypeORMOrder;
};
