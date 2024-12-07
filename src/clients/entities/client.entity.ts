import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Address } from '@addresses/entities/address.entity';
import { Order } from '@orders/entities/order.entity';
import { Payment } from '@payments/entities/payment.entity';
import { Purchase } from '@purchases/entities/purchase.entity';
import { IsOptional } from 'class-validator';
import { User } from '@app/users/entities/user.entity';

@Entity({ name: 'clients' })
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.client, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  user: User;

  @Column({ nullable: true })
  @IsOptional()
  userId: number;

  @OneToMany(() => Address, (address) => address.client, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  addresses: Address[];

  @OneToMany(() => Order, (order) => order.client, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  orders: Order[];

  @OneToMany(() => Purchase, (purchase) => purchase.client, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  purchases: Purchase[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
