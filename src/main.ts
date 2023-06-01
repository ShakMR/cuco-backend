import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.setGlobalPrefix(AppModule.apiPrefix);
  app.useGlobalFilters(AppModule.exceptionFilter);
  const config = new DocumentBuilder()
    .setTitle('Cuco API')
    .setDescription('API serving accounting items')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  await app.listen(AppModule.port || 3000);
}

bootstrap();
