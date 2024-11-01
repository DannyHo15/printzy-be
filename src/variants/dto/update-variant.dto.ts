import { OmitType } from '@nestjs/swagger';
import { CreateVariantDto } from './create-variant.dto';

export class UpdateVariantDto extends OmitType(CreateVariantDto, [
  'optionValues',
] as const) {}
