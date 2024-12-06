import { Controller, Get, UseGuards, Query } from '@nestjs/common';

import { JWTGuard } from '@authentication/jwt.guard';
import { RolesGuard } from '@utils/guards/roles.guard';
import { Roles } from '@utils/decorators/role.decorator';
import { FindTopProductDto } from './dto/find-top-product.dto';
import { AnalyticsService } from './analytics.service';

@Controller('charts')
// @UseGuards(JWTGuard, RolesGuard)
// @Roles('admin')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('top-product')
  public async getTopProducts(@Query() query: FindTopProductDto) {
    return this.analyticsService.getTopProducts(query);
  }

  @Get('top-category')
  public async getTopCategories(@Query() query: FindTopProductDto) {
    return this.analyticsService.getTopCategories(query);
  }

  @Get('top-collection')
  public async getTopCollection(@Query() query: FindTopProductDto) {
    return this.analyticsService.getTopCollections(query);
  }

  @Get('product-analytics')
  public async getProductAnalytics(@Query() query: FindTopProductDto) {
    return this.analyticsService.getProductAnalytics(query);
  }
}
