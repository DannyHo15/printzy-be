import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { District } from '../../district/entities/district.entity';
import { IsOptional } from 'class-validator';
@ApiTags('District')
@Entity({
  name: 'ward',
})
export class Ward {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'The unique identifier of the ward' })
  id: number;

  @Column()
  @ApiProperty({ description: 'The name of the ward' })
  name: string;

  @Column()
  @ApiProperty({ description: 'The code of the ward' })
  code: number;

  @Column()
  @ApiProperty({ description: 'The division type of the ward' })
  division_type: string;

  @Column()
  @ApiProperty({ description: 'The codename of the ward' })
  codename: string;

  @Column({
    nullable: true,
  })
  district_code: number;

  @ManyToOne(() => District, (district) => district.wards)
  @ApiProperty({
    description: 'The district this ward belongs to',
    type: () => District,
  })
  district: District;
}
