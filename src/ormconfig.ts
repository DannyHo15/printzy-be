import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const ormConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: '128.199.168.37',
  port: 5432,
  username: 'postgres',
  password: process.env.POSTGRES_PASSWORD,
  database: 'bonsay',
  synchronize: true, //dont use in production
  autoLoadEntities: true,
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
