import { EntityName } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { MikroRepository } from '../abstracts/abstract_mikro.repository';
import { Session } from './session.entity';

export const SESSION_REPOSITORY = 'SessionRepository';

@Injectable()
export class SessionRepository extends MikroRepository<Session> {
  getEntityName(): EntityName<Session> {
    return Session.name;
  }
}
