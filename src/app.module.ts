import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { InventoryModule } from './inventory/inventory.module';
import { CategoryModule } from './category/category.module';
import { CourierChargesModule } from './courier-charges/courier-charges.module';
import { OrderModule } from './order/order.module';
import { CompanyModule } from './company/company.module';
import { PaymentModule } from './payment/payment.module';
import { LedgerModule } from './ledger/ledger.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { FilesModule } from './files/files.module';
import { CloudinaryModule } from 'nestjs-cloudinary';
import { MulterModule } from '@nestjs/platform-express';
import { SaleModule } from './sale/sale.module';
import * as multer from 'multer';

@Module({
  imports: [
    ConfigModule.forRoot(),
    // TODO: add mongo db url
    MongooseModule.forRoot(
      process.env.MONGO_URI || 'mongodb://localhost:27017/defaultdb',
    ),
    AuthModule,
    UserModule,
    ProductModule,
    InventoryModule,
    CategoryModule,
    CourierChargesModule,
    OrderModule,
    CompanyModule,
    PaymentModule,
    LedgerModule,
    CloudinaryModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        cloud_name: config.get<string>('CLOUDINARY_CLOUD_NAME'),
        api_key: config.get<string>('CLOUDINARY_API_KEY'),
        api_secret: config.get<string>('CLOUDINARY_API_SECRET'),
      }),
      inject: [ConfigService],
    }),
    MulterModule.register({
      limits: { fileSize: 10 * 1024 * 1024 }, // Set file size limit (10MB)
      storage: multer.memoryStorage(),
    }),
    FilesModule,
    SaleModule,
  ],
})
export class AppModule {}
