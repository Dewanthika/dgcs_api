import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductGateway } from './product.gateway';
import { FilesModule } from 'src/files/files.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schema/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    FilesModule,
  ],
  providers: [ProductGateway, ProductService],
})
export class ProductModule {}
