import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Client } from '@clients/entities/client.entity';
import { Order } from '@orders/entities/order.entity';
import { Province } from '@app/province/entities/province.entity';
import { District } from '@app/district/entities/district.entity';
import { Ward } from '@app/ward/entities/ward.entity';
import { User } from '@app/users/entities/user.entity';
import { IsOptional } from 'class-validator';

@Entity({ name: 'addresses' })
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column()
  phone: string;

  @Column()
  addressDetail: string;

  @Column({
    default: false,
  })
  isDefault: boolean;

  @OneToMany(() => Order, (order) => order.address, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  orders: Order[];

  @ManyToOne(() => Province, (province) => province.addresses)
  province: Province;

  @ManyToOne(() => District, (district) => district.addresses)
  district: District;

  @ManyToOne(() => Ward, (ward) => ward.addresses)
  ward: Ward;

  @ManyToOne(() => User, (user) => user.addresses)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
