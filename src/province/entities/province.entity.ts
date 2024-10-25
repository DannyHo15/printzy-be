import { District } from '@app/district/entities/district.entity';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@ApiTags('province')
@Entity({
  name: 'province',
})
export class Province {
  @ApiProperty({ description: 'The unique code of the province', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({})
  @Column()
  code: number;

  @ApiProperty({
    description: 'The name of the province',
    example: 'Thành phố Hà Nội',
  })
  @Column()
  name: string;

  @ApiProperty({
    description: 'The division type of the province',
    example: 'thành phố trung ương',
  })
  @Column()
  division_type: string;

  @ApiProperty({
    description: 'The code name of the province',
    example: 'thanh_pho_ha_noi',
  })
  @Column()
  codename: string;

  @ApiProperty({ description: 'The phone code of the province', example: 24 })
  @Column()
  phone_code: number;

  @OneToMany(() => District, (district) => district.province)
  @ApiProperty({
    description: 'The districts in the province',
    type: () => [District],
  })
  districts: District[];
}
