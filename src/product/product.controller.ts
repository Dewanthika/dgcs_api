import { Controller, Get } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('low-stock')
  async getLowStockProducts() {
    const lowStockProducts = await this.productService.findLowStockProducts();
    return lowStockProducts;
  }
}
