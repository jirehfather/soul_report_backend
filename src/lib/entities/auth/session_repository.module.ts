import { ClassProvider, Module } from '@nestjs/common';
import { SESSION_REPOSITORY, SessionRepository } from './session.repository';

const sessionRepository: ClassProvider = {
  provide: SESSION_REPOSITORY,
  useClass: SessionRepository,
};

const repositories = [sessionRepository];

@Module({
  providers: repositories,
  exports: repositories,
})
export class SessionRepositoryModule {}
