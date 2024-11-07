import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
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

import { OrderStatus } from '@app/declarations';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: ['processing', 'delivery', 'completed', 'cancelled', 'refunded'],
    default: 'processing',
  })
  status: OrderStatus;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @ManyToOne(() => Address, (address) => address.orders, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  address: Address;

  @Column({ nullable: true })
  addressId: number;

  @ManyToOne(() => Client, (client) => client.orders, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  client: Client;

  @Column()
  clientId: number;

  @OneToOne(() => Payment, (payment) => payment.order, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  payment: Payment;

  @OneToMany(() => Purchase, (purchase) => purchase.order, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  purchases: Purchase[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
