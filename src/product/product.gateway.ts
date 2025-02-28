import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@WebSocketGateway()
export class ProductGateway {
  constructor(private readonly productService: ProductService) {}

  @SubscribeMessage('createProduct')
  create(@MessageBody() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @SubscribeMessage('findAllProduct')
  findAll() {
    return this.productService.findAll();
  }

  @SubscribeMessage('findOneProduct')
  findOne(@MessageBody() id: number) {
    return this.productService.findOne(id);
  }

  @SubscribeMessage('updateProduct')
  update(@MessageBody() updateProductDto: UpdateProductDto) {
    return this.productService.update(updateProductDto.id, updateProductDto);
  }

  @SubscribeMessage('removeProduct')
  remove(@MessageBody() id: number) {
    return this.productService.remove(id);
  }
}
