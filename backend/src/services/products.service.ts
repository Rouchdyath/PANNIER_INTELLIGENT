import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';
import { CreateProductDto } from '../dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    // Vérifier que la catégorie existe si elle est spécifiée
    if (createProductDto.categoryId) {
      const category = await this.categoriesRepository.findOne({
        where: { id: createProductDto.categoryId },
      });
      
      if (!category) {
        throw new BadRequestException(`Catégorie avec l'ID ${createProductDto.categoryId} non trouvée`);
      }
    }

    const product = this.productsRepository.create(createProductDto);
    return await this.productsRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return await this.productsRepository.find({
      relations: ['category', 'purchases'],
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['category', 'purchases'],
    });

    if (!product) {
      throw new NotFoundException(`Produit avec l'ID ${id} non trouvé`);
    }

    return product;
  }

  async findByCategory(categoryId: number): Promise<Product[]> {
    return await this.productsRepository.find({
      where: { categoryId },
      relations: ['category'],
      order: { name: 'ASC' },
    });
  }

  async update(id: number, updateProductDto: Partial<CreateProductDto>): Promise<Product> {
    const product = await this.findOne(id);

    // Vérifier que la nouvelle catégorie existe si elle est spécifiée
    if (updateProductDto.categoryId) {
      const category = await this.categoriesRepository.findOne({
        where: { id: updateProductDto.categoryId },
      });
      
      if (!category) {
        throw new BadRequestException(`Catégorie avec l'ID ${updateProductDto.categoryId} non trouvée`);
      }
    }

    Object.assign(product, updateProductDto);
    return await this.productsRepository.save(product);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productsRepository.remove(product);
  }
}