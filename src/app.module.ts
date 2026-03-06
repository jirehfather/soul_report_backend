import { Module } from '@nestjs/common';
import { ApplicationModule } from './app/application.module';
import { CoreModule } from './core/core.module';

@Module({
  imports: [CoreModule, ApplicationModule],
})
export class AppModule {}
