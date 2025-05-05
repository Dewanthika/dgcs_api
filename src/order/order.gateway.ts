import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { Socket } from 'socket.io';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000'],
    credentials: true,
  },
  namespace: '/order',
})
export class OrderGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly orderService: OrderService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('createOrder')
  async create(
    @MessageBody() createOrderDto: CreateOrderDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const order = await this.orderService.create(createOrderDto);
      return {
        event: 'createOrder',
        success: true,
        data: order,
      };
    } catch (error) {
      return {
        event: 'createOrder',
        success: false,
        error: error.message,
      };
    }
  }

  @SubscribeMessage('findAllOrder')
  async findAll(@ConnectedSocket() client: Socket) {
    try {
      const orders = await this.orderService.findAll();
      return {
        event: 'findAllOrder',
        success: true,
        data: orders,
      };
    } catch (error) {
      return {
        event: 'findAllOrder',
        success: false,
        error: error.message,
      };
    }
  }

  @SubscribeMessage('findUserOrders')
  async findUserOrders(@MessageBody() id: string) {
    try {
      const product = await this.orderService.findByUserId(id);
      console.log({id, product})
      return { event: 'findUserOrders', success: true, data: product };
    } catch (error) {
      return { event: 'findUserOrders', success: false, error: error.message };
    }
  }

  @SubscribeMessage('findOneOrder')
  async findOne(@MessageBody() id: string, @ConnectedSocket() client: Socket) {
    try {
      const order = await this.orderService.findOneForEdit(id);
      return {
        event: 'findOneOrder',
        success: true,
        data: order,
      };
    } catch (error) {
      return {
        event: 'findOneOrder',
        success: false,
        error: error.message,
      };
    }
  }

  @SubscribeMessage('updateOrder')
  async update(
    @MessageBody() updateOrderDto: UpdateOrderDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const updatedOrder = await this.orderService.update(
        updateOrderDto.id,
        updateOrderDto,
      );
      return {
        event: 'updateOrder',
        success: true,
        data: updatedOrder,
      };
    } catch (error) {
      return {
        event: 'updateOrder',
        success: false,
        error: error.message,
      };
    }
  }

  @SubscribeMessage('removeOrder')
  async remove(@MessageBody() id: string, @ConnectedSocket() client: Socket) {
    try {
      await this.orderService.remove(id);
      return {
        event: 'removeOrder',
        success: true,
      };
    } catch (error) {
      return {
        event: 'removeOrder',
        success: false,
        error: error.message,
      };
    }
  }
}
