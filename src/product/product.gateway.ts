import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000'],
    credentials: true,
  },
  namespace: '/products',
})
export class ProductGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly productService: ProductService) {}

  @SubscribeMessage('createProduct')
  async create(
    @MessageBody()
    {
      createProductDto,
      file,
    }: {
      createProductDto: CreateProductDto;
      file: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const product = await this.productService.create(createProductDto, file);
      this.server.emit('productCreated', product);
      return { event: 'createProduct', success: true, data: product };
    } catch (error) {
      return { event: 'createProduct', success: false, error: error.message };
    }
  }

  @SubscribeMessage('findAllProduct')
  async findAll() {
    try {
      const products = await this.productService.findAll();
      return { event: 'findAllProduct', success: true, data: products };
    } catch (error) {
      return { event: 'findAllProduct', success: false, error: error.message };
    }
  }

  @SubscribeMessage('findOneProduct')
  async findOne(@MessageBody() id: number) {
    try {
      const product = await this.productService.findOne(id);
      return { event: 'findOneProduct', success: true, data: product };
    } catch (error) {
      return { event: 'findOneProduct', success: false, error: error.message };
    }
  }

  @SubscribeMessage('updateProduct')
  async update(
    @MessageBody()
    {
      id,
      updateProductDto,
      file,
    }: {
      id: string;
      updateProductDto: UpdateProductDto;
      file?: string;
    },
  ) {
    try {
      // Call the service to handle the product update logic
      const updated = await this.productService.update(
        id,
        updateProductDto,
        file,
      );

      // Emit the updated product to all connected clients
      this.server.emit('productUpdated', updated);

      // Return the result of the update process
      return { event: 'updateProduct', success: true, data: updated };
    } catch (error) {
      // Handle any errors and return the error message
      return { event: 'updateProduct', success: false, error: error.message };
    }
  }

  @SubscribeMessage('removeProduct')
  async remove(@MessageBody() id: number) {
    try {
      const removed = await this.productService.remove(id);
      this.server.emit('productRemoved', id); // Broadcast ID to remove
      return { event: 'removeProduct', success: true, data: removed };
    } catch (error) {
      return { event: 'removeProduct', success: false, error: error.message };
    }
  }
}
