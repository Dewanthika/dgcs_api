import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductGateway } from './product.gateway';

@Module({
  providers: [ProductGateway, ProductService],
})
export class ProductModule {}
