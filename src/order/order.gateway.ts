import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@WebSocketGateway()
export class OrderGateway {
  constructor(private readonly orderService: OrderService) {}

  @SubscribeMessage('createOrder')
  create(@MessageBody() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @SubscribeMessage('findAllOrder')
  findAll() {
    return this.orderService.findAll();
  }

  @SubscribeMessage('findOneOrder')
  findOne(@MessageBody() id: number) {
    return this.orderService.findOne(id);
  }

  @SubscribeMessage('updateOrder')
  update(@MessageBody() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(updateOrderDto.id, updateOrderDto);
  }

  @SubscribeMessage('removeOrder')
  remove(@MessageBody() id: number) {
    return this.orderService.remove(id);
  }
}
