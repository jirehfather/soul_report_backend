import { Inject, Injectable } from '@nestjs/common';
import { User } from 'src/lib/entities/user/user.entity';
import {
  USER_REPOSITORY,
  UserRepository,
} from 'src/lib/entities/user/user.repository';

export const USER_SERVICE = Symbol('UserServiceKey');

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
  ) {}

  async getById(id: string): Promise<User | null> {
    return await this.userRepository.findOneByQuery({ id });
  }

  async getByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOneByQuery({ email });
  }
}
