import { ClassProvider, Module } from '@nestjs/common';
import { SessionRepositoryModule } from 'src/lib/entities/auth/session_repository.module';
import { UserRepositoryModule } from 'src/lib/entities/user/user_repository.module';
import { SESSION_SERVICE, SessionService } from './session.service';

const sessionService: ClassProvider = {
  provide: SESSION_SERVICE,
  useClass: SessionService,
};
const servicies = [sessionService];

@Module({
  imports: [SessionRepositoryModule, UserRepositoryModule],
  providers: servicies,
  exports: servicies,
})
export class SessionServiceModule {}
