import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Purchase } from '../entities/purchase.entity';
import { Product } from '../entities/product.entity';
import { CreatePurchaseDto } from '../dto/create-purchase.dto';
import { TopProductAnalysisDto } from '../dto/top-product-analysis.dto';
import { FinancialSummaryDto } from '../dto/financial-summary.dto';

@Injectable()
export class PurchasesService {
  constructor(
    @InjectRepository(Purchase)
    private purchasesRepository: Repository<Purchase>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async create(createPurchaseDto: CreatePurchaseDto): Promise<Purchase> {
    // Validation métier : prix positif
    if (createPurchaseDto.price <= 0) {
      throw new BadRequestException('Le prix doit être positif');
    }

    // Validation métier : date pas dans le futur
    const purchaseDate = new Date(createPurchaseDto.purchaseDate);
    const today = new Date();
    today.setHours(23, 59, 59, 999); // Fin de journée

    if (purchaseDate > today) {
      throw new BadRequestException('La date d\'achat ne peut pas être dans le futur');
    }

    // Vérifier que le produit existe
    const product = await this.productsRepository.findOne({
      where: { id: createPurchaseDto.productId },
    });

    if (!product) {
      throw new BadRequestException(`Produit avec l'ID ${createPurchaseDto.productId} non trouvé`);
    }

    const purchase = this.purchasesRepository.create({
      ...createPurchaseDto,
      purchaseDate,
    });

    return await this.purchasesRepository.save(purchase);
  }

  async findAll(): Promise<Purchase[]> {
    return await this.purchasesRepository.find({
      relations: ['product', 'product.category'],
      order: { purchaseDate: 'DESC', createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Purchase> {
    const purchase = await this.purchasesRepository.findOne({
      where: { id },
      relations: ['product', 'product.category'],
    });

    if (!purchase) {
      throw new NotFoundException(`Achat avec l'ID ${id} non trouvé`);
    }

    return purchase;
  }

  async getTopProduct(): Promise<TopProductAnalysisDto> {
    const result = await this.purchasesRepository
      .createQueryBuilder('purchase')
      .leftJoin('purchase.product', 'product')
      .leftJoin('product.category', 'category')
      .select('product.name', 'productName')
      .addSelect('category.name', 'categoryName')
      .addSelect('COUNT(purchase.id)', 'occurrences')
      .groupBy('product.id, product.name, category.name')
      .orderBy('COUNT(purchase.id)', 'DESC')
      .addOrderBy('product.name', 'ASC') // Pour la cohérence en cas d'égalité
      .limit(1)
      .getRawOne();

    if (!result) {
      throw new NotFoundException('Aucun achat trouvé pour l\'analyse');
    }

    return {
      productName: result.productName,
      occurrences: parseInt(result.occurrences),
      categoryName: result.categoryName,
    };
  }

  async getFinancialSummary(): Promise<FinancialSummaryDto> {
    const result = await this.purchasesRepository
      .createQueryBuilder('purchase')
      .select('SUM(purchase.price)', 'totalAmount')
      .addSelect('COUNT(purchase.id)', 'purchaseCount')
      .getRawOne();

    return {
      totalAmount: parseFloat(result.totalAmount) || 0,
      currency: 'EUR',
      purchaseCount: parseInt(result.purchaseCount) || 0,
    };
  }

  async update(id: number, updatePurchaseDto: Partial<CreatePurchaseDto>): Promise<Purchase> {
    const purchase = await this.findOne(id);

    // Validation métier si le prix est modifié
    if (updatePurchaseDto.price !== undefined && updatePurchaseDto.price <= 0) {
      throw new BadRequestException('Le prix doit être positif');
    }

    // Validation métier si la date est modifiée
    if (updatePurchaseDto.purchaseDate) {
      const purchaseDate = new Date(updatePurchaseDto.purchaseDate);
      const today = new Date();
      today.setHours(23, 59, 59, 999);

      if (purchaseDate > today) {
        throw new BadRequestException('La date d\'achat ne peut pas être dans le futur');
      }
      updatePurchaseDto.purchaseDate = purchaseDate.toISOString();
    }

    // Vérifier que le nouveau produit existe si spécifié
    if (updatePurchaseDto.productId) {
      const product = await this.productsRepository.findOne({
        where: { id: updatePurchaseDto.productId },
      });

      if (!product) {
        throw new BadRequestException(`Produit avec l'ID ${updatePurchaseDto.productId} non trouvé`);
      }
    }

    Object.assign(purchase, updatePurchaseDto);
    return await this.purchasesRepository.save(purchase);
  }

  async remove(id: number): Promise<void> {
    const purchase = await this.findOne(id);
    await this.purchasesRepository.remove(purchase);
  }
}