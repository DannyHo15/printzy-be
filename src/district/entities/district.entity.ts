import { ApiProperty, ApiTags } from '@nestjs/swagger';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Ward } from '@app/ward/entities/ward.entity';
import { Province } from '@app/province/entities/province.entity';
import { IsOptional } from 'class-validator';

@ApiTags('District')
@Entity({
  name: 'district',
})
export class District {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'The unique identifier of the district' })
  id: number;

  @Column()
  @ApiProperty({ description: 'The name of the district' })
  name: string;

  @Column()
  @ApiProperty({ description: 'The code of the district' })
  code: number;

  @Column()
  @ApiProperty({ description: 'The division type of the district' })
  division_type: string;

  @Column()
  @ApiProperty({ description: 'The codename of the district' })
  codename: string;

  @Column({
    nullable: true,
  })
  @IsOptional()
  province_code: number;

  @OneToMany(() => Ward, (ward) => ward.district)
  @ApiProperty({ description: 'The wards in the district', type: () => [Ward] })
  wards: Ward[];

  @ManyToOne(() => Province, (province) => province.districts)
  @ApiProperty({
    description: 'The province this district belongs to',
    type: () => Province,
  })
  province: Province;
}
