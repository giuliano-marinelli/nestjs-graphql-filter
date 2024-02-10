import { PipeTransform } from '@nestjs/common';
import { FindOptionsOrder } from 'typeorm';

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
