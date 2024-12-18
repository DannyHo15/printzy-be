import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Address } from '@addresses/entities/address.entity';
import { Client } from '@clients/entities/client.entity';
import { Payment } from '@payments/entities/payment.entity';
import { OrderStatus } from '@app/utils/types/order';
import { OrderItem } from './orderItem.entity';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.UNPAID,
  })
  status: OrderStatus;

  @Column('decimal', { precision: 30, scale: 2 })
  total: number;

  @Column('decimal', { precision: 30, scale: 2 })
  shippingFee: number;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  orderItems: OrderItem[];

  @ManyToOne(() => Address, (address) => address.orders, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  address: Address;

  @ManyToOne(() => Client, (client) => client.orders, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  client: Client;

  @ManyToOne(() => Payment, (payment) => payment.order, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  payment: Payment;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ unique: true })
  orderNumber: string;
}
