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
import { Variant } from '@app/variants/entities/variant.entity';
import { CustomizeUpload } from '@app/customize-uploads/entities/customize-upload.entity';

@Entity({ name: 'purchases' })
export class Purchase {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.purchases, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    eager: true, // load related Product data with Purchase by default
  })
  product: Product;

  @Column()
  productId: number;

  @Column('int')
  quantity: number;

  @ManyToOne(() => Order, (order) => order.purchases, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  order: Order;

  @Column()
  orderId: number;

  @ManyToOne(() => Client, (client) => client.purchases, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  client: Client;

  @Column()
  clientId: number;

  @OneToOne(() => Variant, { nullable: true })
  @JoinColumn()
  variant: Variant;

  @OneToOne(() => CustomizeUpload, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn()
  customizeUpload: CustomizeUpload;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
