import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto } from '../dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    try {
      const category = this.categoriesRepository.create(createCategoryDto);
      return await this.categoriesRepository.save(category);
    } catch (error) {
      if (error.code === '23505') { // Violation de contrainte unique
        throw new ConflictException(`La catégorie "${createCategoryDto.name}" existe déjà`);
      }
      throw error;
    }
  }

  async findAll(): Promise<Category[]> {
    return await this.categoriesRepository.find({
      relations: ['products'],
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoriesRepository.findOne({
      where: { id },
      relations: ['products'],
    });

    if (!category) {
      throw new NotFoundException(`Catégorie avec l'ID ${id} non trouvée`);
    }

    return category;
  }

  async update(id: number, updateCategoryDto: Partial<CreateCategoryDto>): Promise<Category> {
    const category = await this.findOne(id);
    
    try {
      Object.assign(category, updateCategoryDto);
      return await this.categoriesRepository.save(category);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(`La catégorie "${updateCategoryDto.name}" existe déjà`);
      }
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);
    await this.categoriesRepository.remove(category);
  }
}