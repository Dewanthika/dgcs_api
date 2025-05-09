import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductGateway } from './product.gateway';
import { FilesModule } from 'src/files/files.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schema/product.schema';
import { ProductController } from './product.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    FilesModule,
  ],
  providers: [ProductGateway, ProductService],
  exports: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
