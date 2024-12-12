import { ApiProperty, PartialType } from '@nestjs/swagger';

import { CreatePurchaseDto } from './create-purchase.dto';
import { IsIn, IsOptional } from 'class-validator';
import { PurchaseStatus } from '../entities/purchase.entity';

export class UpdatePurchaseDto extends PartialType(CreatePurchaseDto) {
  @ApiProperty({
    enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
    nullable: true,
  })
  @IsIn(['Pending', 'Completed', 'Failed', 'Refunded'])
  @IsOptional()
  status?: PurchaseStatus;
}
