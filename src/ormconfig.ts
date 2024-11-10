import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const ormConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'dpg-csldc2pu0jms73f508bg-a.singapore-postgres.render.com',
  port: 5432,
  username: 'printzy_db_user',
  password: process.env.POSTGRES_PASSWORD,
  database: 'printzy_db',
  synchronize: true, //dont use in production
  autoLoadEntities: true,
  ssl: {
    rejectUnauthorized: false,
  },
};
