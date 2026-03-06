import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { GroupModule } from './group/group.module';

@Module({
  imports: [AuthModule, GroupModule],
})
export class ApplicationModule {}
