import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { Variant } from '@app/variants/entities/variant.entity';
import { Upload } from '@app/uploads/entities/upload.entity';
import { CustomizeUpload } from '@app/customize-uploads/entities/customize-upload.entity';
import { CustomizePrint } from '@app/customize-uploads/entities/customize-print.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.orderItems, { onDelete: 'CASCADE' })
  order: Order;

  @ManyToOne(() => Variant, (variant) => variant.orderItems, {
    onDelete: 'CASCADE',
  })
  variant: Variant;

  @Column('int')
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  unitPrice: number;

  @OneToOne(() => CustomizeUpload, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  customizeUpload: CustomizeUpload;

  @OneToOne(() => CustomizePrint, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  customizePrint: CustomizePrint;
}
