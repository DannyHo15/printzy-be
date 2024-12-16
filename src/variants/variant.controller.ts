import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Patch,
  Delete,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { VariantsService } from './variant.service';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { JWTGuard } from '@app/authentication/jwt.guard';
import { RolesGuard } from '@app/utils/guards/roles.guard';
import { Roles } from '@app/utils/decorators/role.decorator';

@Controller('products/:productId/variants')
export class VariantsController {
  constructor(private readonly variantsService: VariantsService) {}

  // Create a new variant
  @UseGuards(JWTGuard, RolesGuard)
  @Roles('admin', 'employee')
  @Post()
  async create(
    @Param('productId') productId: number,
    @Body() createVariantDto: CreateVariantDto,
  ) {
    return this.variantsService.create(createVariantDto, productId);
  }

  @Get()
  async findAll(@Param('productId') productId: number) {
    const variants = await this.variantsService.findAll(productId);
    if (!variants.length) {
      throw new NotFoundException(
        `No variants found for product with ID ${productId}`,
      );
    }
    return variants;
  }

  @Get(':id')
  async findOne(
    @Param('productId') productId: number,
    @Param('id') id: number,
  ) {
    const variant = await this.variantsService.findOne(id);
    if (variant.product.id !== productId) {
      throw new NotFoundException(
        `Variant with ID ${id} not found for product with ID ${productId}`,
      );
    }
    return variant;
  }

  // Update a variant by its ID
  @UseGuards(JWTGuard, RolesGuard)
  @Roles('admin', 'employee')
  @Patch(':id')
  async update(
    @Param('productId') productId: number,
    @Param('id') id: number,
    @Body() updateVariantDto: UpdateVariantDto,
  ) {
    const variant = await this.variantsService.update(id, updateVariantDto);

    if (variant.productId !== productId) {
      throw new NotFoundException(
        `Variant with ID ${id} not found for product with ID ${productId}`,
      );
    }
    return variant;
  }

  // Delete a variant by its ID
  @UseGuards(JWTGuard, RolesGuard)
  @Roles('admin', 'employee')
  @Delete(':id')
  async remove(@Param('productId') productId: number, @Param('id') id: number) {
    const variant = await this.variantsService.findOne(id);
    if (variant.product.id !== productId) {
      throw new NotFoundException(
        `Variant with ID ${id} not found for product with ID ${productId}`,
      );
    }
    await this.variantsService.remove(id);
    return { message: `Variant with ID ${id} deleted successfully.` };
  }
}
