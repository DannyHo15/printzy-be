import {
  AfterInsert,
  AfterUpdate,
  Column,
  CreateDateColumn,
  Entity,
  getRepository,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Address } from '@addresses/entities/address.entity';
import { Client } from '@clients/entities/client.entity';
import { Payment } from '@payments/entities/payment.entity';
import { Purchase } from '@purchases/entities/purchase.entity';
import { OrderStatus } from '@app/utils/types/order';
import { OrderItem } from './orderItem.entity';
import { Variant } from '@app/variants/entities/variant.entity';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PROCESSING,
  })
  status: OrderStatus;

  @Column('decimal', { precision: 30, scale: 2 })
  total: number;

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

  @OneToOne(() => Purchase, (purchase) => purchase.order, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  purchase: Purchase;

  @OneToMany(() => Variant, (variant) => variant.order)
  variants: Variant[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
  @Column({ unique: true })
  orderNumber: string;

  @AfterInsert()
  async generateOrderNumber() {
    this.orderNumber = `#ORDER-${this.id.toString().padStart(9, '0')}`;
    await getRepository(Order).save(this);
  }
}
