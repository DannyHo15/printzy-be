import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindTopProductDto } from './dto/find-top-product.dto';
import { OrderItem } from '@app/orders/entities/orderItem.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {}

  async getTopProducts(dto: FindTopProductDto) {
    let { startDate, endDate } = dto;

    if (!startDate) {
      startDate = new Date('2024-01-01T00:00:00.000Z');
    }
    if (!endDate) {
      endDate = new Date('2024-12-31T23:59:59.999Z');
    }

    const query = this.orderItemRepository
      .createQueryBuilder('orderItem')
      .innerJoin('orderItem.variant', 'variant')
      .innerJoin('variant.product', 'product')
      .innerJoin('orderItem.order', 'order')
      .select('product.id', 'productId')
      .addSelect('product.sku', 'productSKU')
      .addSelect('SUM(orderItem.quantity)', 'totalQuantity')
      .groupBy('product.id')
      .addGroupBy('product.sku')
      .orderBy('SUM(orderItem.quantity)', 'DESC');

    query.andWhere('order.createdAt >= :startDate', { startDate });
    query.andWhere('order.createdAt <= :endDate', { endDate });

    const results = await query.getRawMany();

    return results.map((result) => ({
      productId: result.productId,
      productSKU: result.productSKU,
      totalQuantity: Number(result.totalQuantity),
    }));
  }

  async getTopCategories(dto: FindTopProductDto) {
    const { startDate, endDate } = dto;

    const query = this.orderItemRepository
      .createQueryBuilder('orderItem')
      .innerJoin('orderItem.variant', 'variant')
      .innerJoin('variant.product', 'product')
      .innerJoin('orderItem.order', 'order')
      .innerJoin('product.categoryProducts', 'categoryProduct') // Liên kết qua CategoryProduct
      .innerJoin('categoryProduct.category', 'category') // Liên kết với Category
      .select('category.id', 'categoryId') // ID của danh mục
      .addSelect('category.name', 'categoryName') // Tên danh mục
      .addSelect('SUM(orderItem.quantity)', 'totalQuantity')
      .groupBy('category.id')
      .addGroupBy('category.name')
      .orderBy('SUM(orderItem.quantity)', 'DESC'); // Sắp xếp theo tổng số lượng

    query.andWhere('order.createdAt >= :startDate', { startDate });
    query.andWhere('order.createdAt <= :endDate', { endDate });

    const results = await query.getRawMany();

    return results.map((result) => ({
      categoryId: result.categoryId,
      categoryName: result.categoryName,
      totalQuantity: Number(result.totalQuantity),
    }));
  }

  async getTopCollections(dto: FindTopProductDto) {
    const { startDate, endDate } = dto;

    const query = this.orderItemRepository
      .createQueryBuilder('orderItem')
      .innerJoin('orderItem.variant', 'variant')
      .innerJoin('variant.product', 'product')
      .innerJoin('orderItem.order', 'order')
      .innerJoin('product.collection', 'collection') // Liên kết với Collection
      .select('collection.id', 'collectionId') // ID của Collection
      .addSelect('collection.name', 'collectionName') // Tên Collection
      .addSelect('SUM(orderItem.quantity)', 'totalQuantity') // Tổng số lượng
      .groupBy('collection.id')
      .addGroupBy('collection.name')
      .orderBy('SUM(orderItem.quantity)', 'DESC'); // Sắp xếp theo tổng số lượng

    query.andWhere('order.createdAt >= :startDate', { startDate });
    query.andWhere('order.createdAt <= :endDate', { endDate });

    const results = await query.getRawMany();

    return results.map((result) => ({
      collectionId: result.collectionId,
      collectionName: result.collectionName,
      totalQuantity: Number(result.totalQuantity),
    }));
  }
  async getProductAnalytics(dto: FindTopProductDto) {
    let { startDate, endDate } = dto;

    if (!startDate) {
      startDate = new Date('2024-01-01T00:00:00.000Z');
    }
    if (!endDate) {
      endDate = new Date('2024-12-31T23:59:59.999Z');
    }

    const query = this.orderItemRepository
      .createQueryBuilder('orderItem')
      .innerJoin('orderItem.variant', 'variant')
      .innerJoin('variant.product', 'product')
      .innerJoin('orderItem.order', 'order') // Join bảng order
      .leftJoin('product.reviews', 'review') // Join thêm bảng review
      .leftJoin('product.categoryProducts', 'categoryProduct')
      .leftJoin('categoryProduct.category', 'category')
      .select('product.id', 'productId')
      .addSelect('product.name', 'productName')
      .addSelect('product.sku', 'productSKU')
      .addSelect('category.name', 'categoryName')
      .addSelect('SUM(orderItem.quantity)', 'totalSold')
      .addSelect(
        'SUM(orderItem.unitPrice * orderItem.quantity)',
        'totalRevenue',
      )
      .addSelect(
        'SUM((orderItem.unitPrice - variant.baseCost) * orderItem.quantity)',
        'totalProfit',
      )
      .addSelect('COUNT(DISTINCT review.id)', 'totalReviews')
      .groupBy('product.id')
      .addGroupBy('category.name');

    query.andWhere('order.createdAt >= :startDate', { startDate });
    query.andWhere('order.createdAt <= :endDate', { endDate });

    const results = await query.getRawMany();

    return results.map((result) => ({
      productId: result.productId,
      productName: result.productName,
      productSKU: result.productSKU,
      categoryName: result.categoryName || 'Uncategorized',
      totalSold: Number(result.totalSold),
      totalRevenue: Number(result.totalRevenue),
      totalProfit: Number(result.totalProfit),
      totalReviews: Number(result.totalReviews), // Thêm trường vào kết quả
    }));
  }
}
