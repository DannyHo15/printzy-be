import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { UsersModule } from '@users/users.module';
import { AuthenticationModule } from '@authentication/authentication.module';
import { AddressesModule } from '@addresses/addresses.module';
import { ClientsModule } from '@clients/clients.module';
import { OrdersModule } from '@orders/orders.module';
import { PaymentsModule } from '@payments/payments.module';
import { CategoriesModule } from '@categories/categories.module';
import { ProductsModule } from '@products/products.module';
import { PurchasesModule } from '@purchases/purchases.module';
import { UploadsModule } from '@uploads/uploads.module';
import { PhotosModule } from '@photos/photos.module';
import { RevenueChartModule } from '@charts/revenue-chart/revenue-chart.module';
import { CategoriesPieModule } from '@charts/categories-pie/categories-pie.module';
import { OrdersStatusesChartModule } from '@charts/orders-statuses-chart/orders-statuses-chart.module';
import { OrdersCountChartModule } from '@charts/orders-count-chart/orders-count-chart.module';
import { CartModule } from '@app/carts/cart.module';
import { ormConfig } from './ormconfig';
import { WishlistModule } from '@app/wishlists/wishlists.module';
import { CustomizeUploadsModule } from '@app/customize-uploads/customize-uploads.module';
import { ReviewsModule } from '@app/reviews/reviews.module';
import { OptionsModule } from '@app/options/option.module';
import { VariantsModule } from '@app/variants/variant.module';
import { CollectionModule } from '@app/collections/collections.module';
import { ProvinceModule } from './province/province.module';
import { DistrictModule } from './district/district.module';
import { WardModule } from './ward/ward.module';
import { SeedModule } from './database/relational/seed.module';
import { ShipModule } from './ship/ship.module';
import { ShipmentModule } from './shipment/shipment.module';
import { SampleImageModule } from './sample-image/sample-image.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormConfig),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      cache: true,
      expandVariables: true,
    }),
    UsersModule,
    AuthenticationModule,
    AddressesModule,
    ClientsModule,
    OrdersModule,
    PaymentsModule,
    CategoriesModule,
    ProductsModule,
    PurchasesModule,
    UploadsModule,
    PhotosModule,
    RevenueChartModule,
    CategoriesPieModule,
    OrdersStatusesChartModule,
    OrdersCountChartModule,
    CartModule,
    WishlistModule,
    CustomizeUploadsModule,
    ReviewsModule,
    OptionsModule,
    VariantsModule,
    CollectionModule,
    ProvinceModule,
    DistrictModule,
    WardModule,
    SeedModule,
    ShipModule,
    ShipmentModule,
    SampleImageModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
