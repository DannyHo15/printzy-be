import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const ormConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'db-postgresql-printzy-do-user-15473040-0.g.db.ondigitalocean.com',
  port: 25061,
  username: 'doadmin',
  password: 'AVNS_u8jUSGju8ri01Cn7NLH',
  database: 'printzy',
  synchronize: false, //dont use in production
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
