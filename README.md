<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

  <p align="center">A progressive <a href="http://nodejs.org" target="blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/dm/@nestjs/core.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#5" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec"><img src="https://img.shields.io/badge/Donate-PayPal-dc3d53.svg"/></a>
  <a href="https://twitter.com/nestframework"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

#### This is an unofficial Nest package that gives a set of decorators for facilitate the filtering, ordering, pagination and selection tasks when using GraphQL with a ORM.

The package includes decorators `@FilterField`, `@FilterWhereType` and `@FilterOrderType` for make Where and Order input types for GraphQL from entities definitions, and then they correspondent pipe transforms for convert the inputs to valid **TypeORM** repository find method parameters. Also there's included a `@SelectionSet` decorator, that can be used in resolver arguments, which returns a defined class object that gives methods for obtain the relationships that can be used in the **TypeORM** repository find method, or for authorization guards. As well is provided a `PaginationInput` type that gives a simple input type structure for receive pagination parameters.

## Installation

```bash
$ npm install @nestjs!/graphql-filter
```

## Usage

[Code First](#code-first)

- [Entities](#entities)
- [Resolvers](#resolvers)
- [Services](#services)
- [SelectionSet](#selection-set)

[Schema](#schema)

[Query](#query)

[InputTypes Reference](#inputtypes-reference)

**For explain the usage of the package utilities we explore a example with _User_, _Profile_, _Session_ and _Device_ entities.**

### Code First

---

First decorate the entities attributes you want to be filters with `@FilterField` decorator. And then, export _Where_ and _Order_ input classes with the `@FilterWhereType` and `@FilterOrderType` decorators referencing to the entity class:

#### Entities

`user.entity.ts`

```typescript
import {
  Field,
  InputType,
  IntersectionType,
  ObjectType,
  OmitType,
  PartialType,
  PickType,
  registerEnumType
} from '@nestjs/graphql';

import { FilterField, FilterOrderType, FilterWhereType } from '@nestjs!/graphql-filter';

import { IsEmail, MaxLength, MinLength } from 'class-validator';
import { GraphQLEmailAddress, GraphQLUUID } from 'graphql-scalars';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn
} from 'typeorm';

import { Profile, ProfileOrderInput, ProfileWhereInput } from './profile.entity';
import { Session, SessionOrderInput, SessionWhereInput } from 'src/sessions/entities/session.entity';

export enum Role {
  USER = 'user',
  ADMIN = 'admin'
}

registerEnumType(Role, {
  name: 'Role',
  description: 'Defines wich permissions user has.',
  valuesMap: {
    USER: {
      description: 'User role can access to application basic features.'
    },
    ADMIN: {
      description: 'Admin role can access to all application features.'
    }
  }
});

@ObjectType()
@InputType('UserInput', { isAbstract: true })
@Entity()
export class User {
  @Field(() => GraphQLUUID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @FilterField()
  @Column()
  @Unique(['username'])
  @MinLength(4)
  @MaxLength(30)
  username: string;

  @Field(() => GraphQLEmailAddress)
  @FilterField()
  @Column()
  @Unique(['email'])
  @IsEmail()
  @MaxLength(100)
  email: string;

  @Field()
  @Column()
  @MinLength(8)
  @MaxLength(100)
  password: string;

  @Field(() => Role, { nullable: true })
  @FilterField()
  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @Field(() => Profile, { nullable: true })
  @FilterField(() => ProfileWhereInput, () => ProfileOrderInput)
  @Column(() => Profile)
  profile: Profile;

  @Field(() => [Session], { nullable: true })
  @FilterField(() => SessionWhereInput, () => SessionOrderInput)
  @OneToMany(() => Session, (session) => session.user, { cascade: true })
  sessions: Session[];
}

@InputType()
export class UserCreateInput extends OmitType(
  User,
  ['id', 'createdAt', 'updatedAt', 'deletedAt', 'sessions'],
  InputType
) {}

@InputType()
export class UserUpdateInput extends IntersectionType(
  PartialType(UserCreateInput),
  PickType(User, ['id'], InputType)
) {}

@FilterWhereType(User)
export class UserWhereInput {}

@FilterOrderType(User)
export class UserOrderInput {}
```

`profile.entity.ts`

```typescript
...
import { FilterField, FilterOrderType, FilterWhereType, FloatWhereInput, IntWhereInput } from '@nestjs!/graphql-filter';

@ObjectType()
@InputType('ProfileInput')
export class Profile {
  @Field({ nullable: true })
  @FilterField()
  @Column({ nullable: true })
  name: string;

  @Field({ nullable: true })
  @FilterField()
  @Column({ nullable: true })
  bio: string;

  @Field(() => GraphQLInt)
  @FilterField(() => IntWhereInput)
  age: number

  @Field(() => GraphQLFloat)
  @FilterField(() => FloatWhereInput)
  height: number
}

@FilterWhereType(Profile)
export class ProfileWhereInput {}

@FilterOrderType(Profile)
export class ProfileOrderInput {}
```

`session.entity.ts`

```typescript
...
import { FilterField, FilterOrderType, FilterWhereType } from '@nestjs!/graphql-filter';

import { Device, DeviceOrderInput, DeviceWhereInput } from './device.entity';
import { User, UserOrderInput, UserWhereInput } from 'src/users/entities/user.entity';

@ObjectType()
@InputType('SessionInput', { isAbstract: true })
@Entity()
export class Session {
  @Field(() => GraphQLUUID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => User, { nullable: true })
  @FilterField(() => UserWhereInput, () => UserOrderInput)
  @ManyToOne(() => User, (user) => user.sessions)
  user: User;

  @Field()
  @FilterField()
  @Column()
  token: string;

  @Field(() => Device, { nullable: true })
  @FilterField(() => DeviceWhereInput, () => DeviceOrderInput)
  @Column(() => Device)
  device: Device;
}

@FilterWhereType(Session)
export class SessionWhereInput {}

@FilterOrderType(Session)
export class SessionOrderInput {}
```

`device.entity.ts`

```typescript
...
import { FilterField, FilterOrderType, FilterWhereType } from '@nestjs!/graphql-filter';

@ObjectType()
@InputType('DeviceInput')
export class Device {
  @Field({ nullable: true })
  @FilterField()
  @Column({ nullable: true })
  client: string;

  @Field({ nullable: true })
  @FilterField()
  @Column({ nullable: true })
  os: string;

  @Field({ nullable: true })
  @FilterField()
  @Column({ nullable: true })
  ip: string;
}

@FilterWhereType(Device)
export class DeviceWhereInput {}

@FilterOrderType(Device)
export class DeviceOrderInput {}
```

#### Resolvers

Now in the entities resolvers we can define a _findAll_ method that receives the correspondent filtering, ordering, pagination and selection parameters and apply the pipe transforms for get, in this case, the TypeORM formatted parameters for use with the repository find method. For example for the _Users_ resolver:

`users.resolver.ts`

```typescript
...
import {
  PaginationInput,
  SelectionInput,
  SelectionSet,
  TypeORMOrderTransform,
  TypeORMWhereTransform
} from '@nestjs!/graphql-filter';

import { FindOptionsOrder, FindOptionsWhere } from 'typeorm';

import { User, UserCreateInput, UserOrderInput, UserUpdateInput, UserWhereInput } from './entities/user.entity';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  ...

  @Query(() => [User], { name: 'users', nullable: 'items' })
  async findAll(
    @Args('where', { type: () => [UserWhereInput], nullable: true }, TypeORMWhereTransform<User>)
    where: FindOptionsWhere<User>,
    @Args('order', { type: () => [UserOrderInput], nullable: true }, TypeORMOrderTransform<User>)
    order: FindOptionsOrder<User>,
    @Args('pagination', { nullable: true }) pagination: PaginationInput,
    @SelectionSet() selection: SelectionInput
  ) {
    return await this.usersService.findAll({ where, order, pagination });
  }
}
```

#### Services

Last step is define the correspondent services using the transformed parameters with the entity repository provided by TypeORM. For example for the _Users_ service:

`users.service.ts`

```typescript
...
import { PaginationInput, SelectionInput } from '@nestjs!/graphql-filter';

import { FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm';

import { User, UserCreateInput, UserUpdateInput } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  ...

  async findAll(options: {
    where?: FindOptionsWhere<User>;
    order?: FindOptionsOrder<User>;
    pagination?: PaginationInput;
    selection?: SelectionInput;
  }) {
    return await this.usersRepository.find({
      relations: options.selection?.getTypeORMRelations(),
      where: options.where,
      order: options.order,
      skip: options.pagination ? (options.pagination.page - 1) * options.pagination?.count : null,
      take: options.pagination ? options.pagination.count : null
    });
  }
}
```

#### SelectionSet

When using the `@SelectionSet` decorator you will get a `SelectionInput` object which is obtained by processing the GraphQL context info and organized for easily accessing the selection.

From this object you have the next methods at disposition:

`getAttributes()`: returns a string array with only the entity attributes selected, it means that relationships are not included. For example, for the query of the next section we get:

```json
["id", "username", "email", "role"]
```

`getFullAttributes()`: returns a string array with all the entity attributes selected and the relationships ones. For example, for the query of the next section we get:

<!-- prettier-ignore -->
```json
[
  "id", "username", "email", "role", "profile.name", "profile.bio", "profile.age", "profile.height", "sessions.id", "sessions.token", "sessions.device.client", "sessions.device.os", "sessions.device.ip"
]
```

`getRelations()`: returns a string array with only the relations names that are selected. For example, for the query of the next section we get:

```json
["profile", "sessions"]
```

`getTypeORMRelations()`: returns a object formatted for been used in TypeORM repository find relations parameter. For example, for the query of the next section we get:

```typescript
{
    profile: true,
    sessions: true
}
```

### Schema

---

With decorators defined the package will generate the correspondent GraphQL basic filtering, ordering and pagination input types and the specific entities input types at compilation time with the rest of types.

For example for _User_ entity it will generate:

`schema.gql`

```graphql
input UserWhereInput {
  email: StringWhereInput
  profile: ProfileWhereInput
  role: StringWhereInput
  username: StringWhereInput
}

input UserOrderInput {
  email: OrderDirection
  profile: OrderDirection
  role: OrderDirection
  username: OrderDirection
}
```

### Query

---

Now we can execute our Nest project and make GraphQL queries with the filtering, ordering and pagination parameters defined. For example for the defined _users_ query:

`QUERY`

```graphql
query Users($where: [UserWhereInput!], $order: [UserOrderInput!], $pagination: PaginationInput) {
  users(where: $where, order: $order, pagination: $pagination) {
    id
    username
    email
    role
    profile {
      name
      bio
      age
      height
    }
    sessions {
      id
      token
      device {
        client
        os
        ip
      }
    }
  }
}
```

`GRAPHQL VARIABLES`

```json
{
  "where": [
    {
      "username": {
        "or": [
          {
            "ne": "something"
          },
          {
            "like": "%some%"
          }
        ]
      },
      "profile": {
        "name": {
          "ilike": "Georgy Something"
        }
      },
      "sessions": {
        "device": {
          "client": {
            "like": "%Postman%"
          }
        }
      }
    },
    {
      "role": {
        "eq": "admin"
      },
      "email": {
        "and": [
          {
            "in": ["some@thing.com", "something@nothing.com"]
          },
          {
            "not": {
              "any": ["asd@asd.com"]
            }
          }
        ]
      }
    }
  ],
  "order": [
    {
      "username": "ASC"
    },
    {
      "email": "DESC"
    },
    {
      "profile": {
        "name": "ASC"
      }
    }
  ],
  "pagination": {
    "page": 2,
    "count": 10
  }
}
```

Here we can note that the "where" variable can be an array or a object, meaning that it's an OR clause or AND clause respectively.

For "order" variable something similar happen, we can define the variable as an array or object, but if it's a object we can't ensure the priority of the ordering parameters.

### InputTypes Reference

`StringWhereInput`

```graphql
input StringWhereInput {
  eq: String
  ne: String
  like: String
  ilike: String
  in: [String!]
  any: [String!]
  and: [StringWhereInput!]
  or: [StringWhereInput!]
  not: StringWhereInput
}
```

`IntWhereInput`

```graphql
input IntWhereInput {
  eq: Int
  ne: Int
  gt: Int
  gte: Int
  lt: Int
  lte: Int
  in: [Int!]
  any: [Int!]
  between: [Int!]
  and: [IntWhereInput!]
  or: [IntWhereInput!]
  not: IntWhereInput
}
```

`FloatWhereInput`

```graphql
input FloatWhereInput {
  eq: Float
  ne: Float
  gt: Float
  gte: Float
  lt: Float
  lte: Float
  in: [Float!]
  any: [Float!]
  between: [Float!]
  and: [FloatWhereInput!]
  or: [FloatWhereInput!]
  not: FloatWhereInput
}
```

`DateTimeWhereInput`

```graphql
input DateTimeWhereInput {
  eq: DateTime
  ne: DateTime
  gt: DateTime
  gte: DateTime
  lt: DateTime
  lte: DateTime
  in: [DateTime!]
  any: [DateTime!]
  between: [DateTime!]
  and: [DateTimeWhereInput!]
  or: [DateTimeWhereInput!]
  not: DateTimeWhereInput
}
```

`BooleanWhereInput`

```graphql
input BooleanWhereInput {
  eq: Boolean
  ne: Boolean
  and: [BooleanWhereInput!]
  or: [BooleanWhereInput!]
  not: BooleanWhereInput
}
```

`PaginationInput`

```graphql
input PaginationInput {
  count: Int!
  page: Int!
}
```

`OrderDirection`

```graphql
"""
Defines the order direction.
"""
enum OrderDirection {
  """
  Ascending order.
  """
  ASC

  """
  Descending order.
  """
  DESC
}
```

## Stay in touch

### Me

- Author - [Giuliano Marinelli](https://www.linkedin.com/in/giuliano-marinelli/)
- Website - [https://github.com/giuliano-marinelli](https://github.com/giuliano-marinelli)

### Nest

- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest and this package are [MIT licensed](LICENSE).
