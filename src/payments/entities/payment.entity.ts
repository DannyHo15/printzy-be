import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Client } from '@clients/entities/client.entity';
import { Order } from '@orders/entities/order.entity';

export enum PaymentMethod {
  MOMO = 'momo',
  VNPAY = 'vnpay',
  BANK_TRANSFER = 'bank_transfer',
}

@Entity({ name: 'payments' })
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 30, scale: 2 })
  sum: number;

  @ManyToOne(() => Client, (client) => client.payments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  client: Client;

  @Column()
  clientId: number;

  @OneToOne(() => Order, (order) => order.payment, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  order: Order;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    default: PaymentMethod.BANK_TRANSFER,
  })
  paymentMethod: PaymentMethod;

  @Column()
  orderId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
