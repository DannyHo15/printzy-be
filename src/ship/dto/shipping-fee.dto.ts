import { ApiProperty } from '@nestjs/swagger';

export class Fee {
  @ApiProperty()
  name: string;

  @ApiProperty()
  fee: number;

  @ApiProperty()
  insurance_fee: number;

  @ApiProperty()
  include_vat: number;

  @ApiProperty()
  cost_id: number;

  @ApiProperty()
  delivery_type: string;

  @ApiProperty()
  a: number;

  @ApiProperty()
  dt: string;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
      properties: {
        display: { type: 'string' },
        title: { type: 'string' },
        amount: { type: 'number' },
        type: { type: 'string' },
      },
    },
  })
  extFees: {
    display: string;
    title: string;
    amount: number;
    type: string;
  }[];

  @ApiProperty()
  promotion_key: string;

  @ApiProperty()
  delivery: boolean;

  @ApiProperty()
  ship_fee_only: number;

  @ApiProperty()
  distance: number;

  @ApiProperty({
    type: 'object',
    properties: {
      name: { type: 'string' },
      title: { type: 'string' },
      shipMoney: { type: 'number' },
      shipMoneyText: { type: 'string' },
      vatText: { type: 'string' },
      desc: { type: 'string' },
      coupon: { type: 'string' },
      maxUses: { type: 'number' },
      maxDates: { type: 'number' },
      maxDateString: { type: 'string' },
      content: { type: 'string' },
      activatedDate: { type: 'string' },
      couponTitle: { type: 'string' },
      discount: { type: 'string' },
    },
  })
  options: {
    name: string;
    title: string;
    shipMoney: number;
    shipMoneyText: string;
    vatText: string;
    desc: string;
    coupon: string;
    maxUses: number;
    maxDates: number;
    maxDateString: string;
    content: string;
    activatedDate: string;
    couponTitle: string;
    discount: string;
  };
}

export class ShipDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty({ type: Fee })
  fee: Fee;
}
