import { Controller, Get, UseGuards, Query } from '@nestjs/common';

import { JWTGuard } from '@authentication/jwt.guard';
import { RolesGuard } from '@utils/guards/roles.guard';
import { Roles } from '@utils/decorators/role.decorator';
import { FindTopProductDto } from './dto/find-top-product.dto';
import { AnalyticsService } from './analytics.service';

@Controller('charts')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @UseGuards(JWTGuard, RolesGuard)
  @Roles('admin')
  @Get('top-product')
  public async getTopProducts(@Query() query: FindTopProductDto) {
    return this.analyticsService.getTopProducts(query);
  }

  @UseGuards(JWTGuard, RolesGuard)
  @Roles('admin')
  @Get('top-category')
  public async getTopCategories(@Query() query: FindTopProductDto) {
    return this.analyticsService.getTopCategories(query);
  }

  @UseGuards(JWTGuard, RolesGuard)
  @Roles('admin')
  @Get('top-collection')
  public async getTopCollection(@Query() query: FindTopProductDto) {
    return this.analyticsService.getTopCollections(query);
  }

  @UseGuards(JWTGuard, RolesGuard)
  @Roles('admin')
  @Get('product-analytics')
  public async getProductAnalytics(@Query() query: FindTopProductDto) {
    return this.analyticsService.getProductAnalytics(query);
  }

  @UseGuards(JWTGuard, RolesGuard)
  @Roles('admin')
  @Get('order-total-by-date-analytics')
  public async calculateTotalByDay(@Query() query: FindTopProductDto) {
    return this.analyticsService.calculateTotalByDay(query);
  }
}
