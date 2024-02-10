import { registerEnumType } from '@nestjs/graphql';

export enum OrderDirection {
  ASC = 'ASC',
  DESC = 'DESC'
}

registerEnumType(OrderDirection, {
  name: 'OrderDirection',
  description: 'Defines the order direction.',
  valuesMap: {
    ASC: {
      description: 'Ascending order.'
    },
    DESC: {
      description: 'Descending order.'
    }
  }
});
