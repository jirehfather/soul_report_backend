import { Module } from '@nestjs/common';
import { UserServiceModule } from 'src/lib/services/user/user_service.module';
import { AuthController } from './controllers/auth.controller';
import { SessionServiceModule } from 'src/lib/services/session/session_service.module';

@Module({
  imports: [SessionServiceModule, UserServiceModule],
  controllers: [AuthController],
})
export class AuthModule {}
