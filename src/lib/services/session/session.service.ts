import { Inject, Injectable } from '@nestjs/common';
import {
  SESSION_REPOSITORY,
  SessionRepository,
} from 'src/lib/entities/auth/session.repository';
import {
  USER_REPOSITORY,
  UserRepository,
} from 'src/lib/entities/user/user.repository';
import { Session } from '../../entities/auth/session.entity';

export const SESSION_SERVICE = Symbol('SessionServiceKey');

@Injectable()
export class SessionService {
  constructor(
    @Inject(SESSION_REPOSITORY)
    private readonly sessionRepository: SessionRepository,
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
  ) {}

  async createSession(session: Session): Promise<string> {
    await this.sessionRepository.save(session);
    return session.sessionToken;
  }

  async getByToken(token: string): Promise<Session | null> {
    return await this.sessionRepository.findOneByQuery(
      {
        sessionToken: token,
      },
      { populate: ['user', 'user.profile'] },
    );
  }

  async remove(session: Session | null): Promise<void> {
    if (session === null) return;
    await this.sessionRepository.remove(session);
  }
}
