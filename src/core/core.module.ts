import { MikroORM } from '@mikro-orm/postgresql';
import { Logger, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { MikroModule } from './database/mikro.module';
import { AppConfigModule } from './config/config.module';
import { AuthorizationGuard } from './guards/authorization.guard';
import { SessionServiceModule } from 'src/lib/services/session/session_service.module';
import { UserServiceModule } from 'src/lib/services/user/user_service.module';

@Module({
  imports: [
    AppConfigModule,
    MikroModule.forRoot(),
    SessionServiceModule,
    UserServiceModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: AuthorizationGuard }],
})
export class CoreModule {
  private readonly logger: Logger = new Logger(CoreModule.name);

  constructor(private readonly orm: MikroORM) {}

  async onModuleInit(): Promise<void> {
    this.logger.log(`Start MikroORM Migration...`);
    try {
      await this.orm.migrator.up();
    } catch (error) {
      this.logger.error(`MikroORM Migration Failed.`, error);
      throw error;
    }
    this.logger.log(`MikroORM Migration Completed.`);
  }

  async onApplicationShutdown(signal?: string) {
    this.logger.log(`Start Shut Down Graceful with ${signal}`);
    await Promise.resolve().then(async () => {
      this.logger.log('Try Resources Close...');

      const isConnected = await this.orm.isConnected();
      if (isConnected) {
        this.logger.log('Start MikroORM Close...');
        await this.orm.close();
      }

      this.logger.log('Finish Resources Close...');
    });
  }
}
