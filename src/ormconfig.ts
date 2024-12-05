import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const ormConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: +process.env.POSTGRES_PORT,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: true, //dont use in production
  autoLoadEntities: true,
  ssl: {
    rejectUnauthorized: false,
  },
};
// export const ormConfig: TypeOrmModuleOptions = {
//   type: 'postgres',
//   host: 'bonsay_db',
//   port: 5432,
//   username: 'postgres',
//   password: 'postgres',
//   database: 'bonsay',
//   synchronize: true, //dont use in production
//   autoLoadEntities: true,
// };
