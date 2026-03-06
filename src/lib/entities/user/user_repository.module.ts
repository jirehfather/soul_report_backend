import { ClassProvider, Injectable, Module } from '@nestjs/common';
import { UserRepository, USER_REPOSITORY } from './user.repository';

const userRepository: ClassProvider = {
  provide: USER_REPOSITORY,
  useClass: UserRepository,
};

const repositories = [userRepository];

@Module({
  providers: repositories,
  exports: repositories,
})
export class UserRepositoryModule {}
