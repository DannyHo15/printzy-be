import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  @OneToMany(() => Order, (order) => order.payment, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  order: Order[];

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    default: PaymentMethod.VNPAY,
  })
  paymentMethod: PaymentMethod;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
