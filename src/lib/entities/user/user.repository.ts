import { EntityName } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { MikroRepository } from '../abstracts/abstract_mikro.repository';
import { User } from './user.entity';

export const USER_REPOSITORY = Symbol('UserRepositoryKey');

@Injectable()
export class UserRepository extends MikroRepository<User> {
  getEntityName(): EntityName<User> {
    return User.name;
  }
}
