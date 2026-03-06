import { EntityManager, MikroORM } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { User } from './lib/entities/user.entity';

@Injectable()
export class AppService {
  constructor(private readonly em: EntityManager) {}

  async getHello(): Promise<string> {
    const user = await this.em.findOne(User, { email: '123' });
    if (user === null) {
      return 'User not found';
    } else {
      return 'Hello';
    }
  }
}
