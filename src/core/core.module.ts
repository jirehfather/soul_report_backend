import { Module } from '@nestjs/common';
import { EnvModule } from './env/env.module';
import { MikroModule } from './database/mikro.module';

@Module({
  imports: [EnvModule, MikroModule],
})
export class CoreModule {}
