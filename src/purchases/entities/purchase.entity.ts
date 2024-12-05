import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Client } from '@clients/entities/client.entity';
import { Order } from '@orders/entities/order.entity';
import { Product } from '@products/entities/product.entity';

@Entity({ name: 'purchases' })
export class Purchase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  transactionId: string;

  @Column('int')
  quantity: number;

  @OneToOne(() => Order, (order) => order.purchase, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  order: Order;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Client, (client) => client.purchases)
  client: Client;

  @Column()
  clientId: number;
}
