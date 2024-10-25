import { Module } from '@nestjs/common';
import { AddressModule } from './address/address-seed.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { OrmConfigService } from './orm-config.service';
@Module({
  imports: [
    AddressModule,
    TypeOrmModule.forRootAsync({
      useClass: OrmConfigService,
      dataSourceFactory: async (options: DataSourceOptions) => {
        return new DataSource(options).initialize();
      },
    }),
  ],
})
export class SeedModule {}
