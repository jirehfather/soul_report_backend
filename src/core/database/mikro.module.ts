import { Migrator, TSMigrationGenerator } from '@mikro-orm/migrations';
import {
  MaybePromise,
  MikroOrmModule,
  MikroOrmModuleOptions,
} from '@mikro-orm/nestjs';
import {
  LoadStrategy,
  PostgreSqlDriver,
  UnderscoreNamingStrategy,
} from '@mikro-orm/postgresql';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { DynamicModule } from '@nestjs/common';

const POSTGRESQL_CONNECTION = {
  HOST: process.env.POSTGRES_HOST,
  PORT: process.env.POSTGRES_PORT ?? 5432,
  USERNAME: process.env.POSTGRES_USERNAME!,
  PASSWORD: process.env.POSTGRES_PASSWORD!,
  DATABASE: process.env.POSTGRES_DATABASE!,
};

export const generatePgOption: MikroOrmModuleOptions<PostgreSqlDriver> = {
  driver: PostgreSqlDriver,
  // * Database Connection Settings
  dbName: POSTGRESQL_CONNECTION.DATABASE,
  user: POSTGRESQL_CONNECTION.USERNAME,
  password: POSTGRESQL_CONNECTION.PASSWORD,
  host: POSTGRESQL_CONNECTION.HOST,
  port: +POSTGRESQL_CONNECTION.PORT,
  pool: {
    max: 10,
    idleTimeoutMillis: 30000,
  },

  allowGlobalContext: true,
  debug: process.env.NODE_ENV === 'development' ? true : false,

  // * ORM Entities Path
  entities: ['dist/lib/entities/*/!(abstract)*.entity.js'],
  entitiesTs: ['src/lib/entities/*/!(abstract)*.entity.ts'],

  // * One To Many Setting (One To One일 때 연관관계의 주인을 조회 할 때 자동으로 Join 할 것인지)
  autoJoinOneToOneOwner: false,

  // * sql highlighter (Query, Migration 등을 강조할 때 사용)
  highlighter: new SqlHighlighter(),

  // * Naming Strategy
  namingStrategy: UnderscoreNamingStrategy,

  // * Migration Options
  extensions: [Migrator],
  migrations: {
    allOrNothing: true, // * 마이그레이션 실행 시 전부 통과하지 않는 이상 마이그레이션은 통과하지 않는다.
    transactional: true, // * 마이그레이션 실행 시 트랜잭션을 이용하여 처리
    snapshot: false,
    tableName: 'soul_report_migrations',
    emit: 'ts',
    disableForeignKeys: false,
    path: 'dist/migrations',
    pathTs: 'src/migrations',
    glob: '!(*.d).{js,ts,cjs}',
    generator: TSMigrationGenerator,
  },

  /**
   * loadStrategy ( DEFAULT - SELECT_IN)
   * * Load Strategy (SELECT_IN : population Option을 사용 && 1:N 일 때 1을 조회하고 1을 통해 N을 조회하는 Query가 2번 발생한다.)
   * * Load Strategy (JOINED : population Option을 사용 && 1:N 일 때 1을 조회하며 Join을 이용하여 N을 가져온다.)
   */
  loadStrategy: LoadStrategy.JOINED,

  // * for development
  discovery: {
    warnWhenNoEntities: false,
  },

  // * 생성자 필수 호출
  forceEntityConstructor: false,

  // schema: 'soul_report',
};
export default generatePgOption;

export class MikroModule {
  static forRoot(): MaybePromise<DynamicModule> {
    return MikroOrmModule.forRoot(generatePgOption);
  }
}
