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

export enum PurchaseStatus {
  PENDING = 'Pending',
  COMPLETED = 'Completed',
  FAILED = 'Failed',
}
@Entity({ name: 'purchases' })
export class Purchase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  transactionId: string;

  @OneToOne(() => Order, {
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

  @Column({
    type: 'enum',
    enum: PurchaseStatus,
    default: PurchaseStatus.PENDING,
  })
  status: PurchaseStatus;
}
