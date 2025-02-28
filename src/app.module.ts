import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { InventoryModule } from './inventory/inventory.module';
import { CategoryModule } from './category/category.module';
import { CourierChargesModule } from './courier-charges/courier-charges.module';
import { OrderModule } from './order/order.module';
import { OrderItemModule } from './order-item/order-item.module';
import { CompanyModule } from './company/company.module';
import { PaymentModule } from './payment/payment.module';
import { LedgerModule } from './ledger/ledger.module';
import { UserTypeModule } from './user-type/user-type.module';

@Module({
  imports: [AuthModule, UserModule, ProductModule, InventoryModule, CategoryModule, CourierChargesModule, OrderModule, OrderItemModule, CompanyModule, PaymentModule, LedgerModule, UserTypeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
