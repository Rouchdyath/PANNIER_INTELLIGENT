import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category, Product, Purchase } from '../entities';
import { CategoriesService, ProductsService, PurchasesService } from '../services';
import { CategoriesController, ProductsController, PurchasesController } from '../controllers';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Product, Purchase])],
  controllers: [CategoriesController, ProductsController, PurchasesController],
  providers: [CategoriesService, ProductsService, PurchasesService],
  exports: [CategoriesService, ProductsService, PurchasesService],
})
export class CoursesModule {}