import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const LOGGER = new Logger();
  const PORT = process.env.PORT ?? 8081;
  const app = await NestFactory.create(AppModule, { logger: ['debug'] });
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
  });
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('DGCS API')
    .setDescription('API for the DGCS project')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-doc', app, document);
  await app.listen(PORT, () => {
    LOGGER.log(
      `Management Service Swagger UI at ${'http://localhost:' + PORT}/api-doc`,
    );
  });
}
bootstrap();
