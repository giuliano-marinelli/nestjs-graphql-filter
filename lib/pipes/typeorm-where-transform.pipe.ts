import { PipeTransform } from '@nestjs/common';

import {
  And,
  Any,
  Between,
  Equal,
  FindOptionsWhere,
  ILike,
  In,
  LessThan,
  LessThanOrEqual,
  Like,
  MoreThan,
  MoreThanOrEqual,
  Not,
  Or
} from 'typeorm';

/**
 * Transforms the input value into a FindOptionsWhere object for TypeORM.
 * @template T - The type of the input value.
 */
export class TypeORMWhereTransform<T> implements PipeTransform {
  transform(value: T) {
    return transformTypeORMWhere(value) as FindOptionsWhere<T>;
  }
}

// receives the entity specific T filter and transforms it into a typeorm filter (FindOptionsWhere<T>)
// specifically transform: eq, ne, gt, gte, lt, lte, like, ilike, in, any, between, and, or, not. Into typeorm options
// example: [ { username: { and: [ { eq: "asd" }, { like: "%s%" } ] } }, { role: { ne: "user" } } ]
// transformed: [ { username: And(Equal("asd"), Like("%s%")), role: Not(Equal("user")) } ]
const transformTypeORMWhere = (where: any): any[] | any => {
  let TypeORMWhere: any[] | any;

  if (!where) return {};

  if (Array.isArray(where)) {
    TypeORMWhere = [];
    where.forEach((wherePart) => {
      const transformedWherePart = transformTypeORMWhere(wherePart);
      if (Array.isArray(transformedWherePart)) TypeORMWhere.push(...transformedWherePart);
      else TypeORMWhere.push(transformedWherePart);
    });
  } else if (typeof where == 'object') {
    TypeORMWhere = {};
    Object.keys(where)?.forEach((field) => {
      if (field == 'and') {
        TypeORMWhere = And(...transformTypeORMWhere(where[field]));
      } else if (field == 'or') {
        TypeORMWhere = Or(...transformTypeORMWhere(where[field]));
      } else if (field == 'not') {
        TypeORMWhere = Not(transformTypeORMWhere(where[field]));
      } else if (field == 'eq') {
        TypeORMWhere = Equal(where[field]);
      } else if (field == 'ne') {
        TypeORMWhere = Not(Equal(where[field]));
      } else if (field == 'gt') {
        TypeORMWhere = MoreThan(where[field]);
      } else if (field == 'gte') {
        TypeORMWhere = MoreThanOrEqual(where[field]);
      } else if (field == 'lt') {
        TypeORMWhere = LessThan(where[field]);
      } else if (field == 'lte') {
        TypeORMWhere = LessThanOrEqual(where[field]);
      } else if (field == 'like') {
        TypeORMWhere = Like(where[field]);
      } else if (field == 'ilike') {
        TypeORMWhere = ILike(where[field]);
      } else if (field == 'in') {
        TypeORMWhere = In(where[field]);
      } else if (field == 'any') {
        TypeORMWhere = Any(where[field]);
      } else if (field == 'between') {
        TypeORMWhere = Between(where[field][0], where[field][1]);
      } else {
        TypeORMWhere[field] = transformTypeORMWhere(where[field]);
      }
    });
  }

  return TypeORMWhere;
};
