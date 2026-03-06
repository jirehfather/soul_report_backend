import { Logger, Module } from '@nestjs/common';
import { EnvModule } from './env/env.module';
import { MikroModule } from './database/mikro.module';
import { MikroORM } from '@mikro-orm/postgresql';

@Module({
  imports: [EnvModule, MikroModule.forRoot()],
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
