import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Client } from '@clients/entities/client.entity';
import { Order } from '@orders/entities/order.entity';
import { Province } from '@app/province/entities/province.entity';
import { District } from '@app/district/entities/district.entity';
import { Ward } from '@app/ward/entities/ward.entity';

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

  @Column()
  postcode: string;

  @Column()
  isDefault: boolean;

  @ManyToOne(() => Client, (client) => client.addresses, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  client: Client;

  @Column()
  clientId?: number;

  @OneToMany(() => Order, (order) => order.address, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  orders: Order[];

  @ManyToOne(() => Province)
  province: Province;

  @ManyToOne(() => District)
  district: District;

  @ManyToOne(() => Ward)
  ward: Ward;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
