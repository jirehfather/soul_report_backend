import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core/core.module';
import { MikroORM } from '@mikro-orm/postgresql';

@Module({
  imports: [CoreModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  private readonly logger: Logger = new Logger(AppModule.name);

  constructor(private readonly orm: MikroORM) {}

  async onModuleInit(): Promise<void> {
    await this.orm.migrator.up();
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
