import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
    .setTitle('AREA 51')
    .setDescription('AREA 51 API documentation')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('documentation', app, document);
  await app.listen(8080);
}
bootstrap().then(() => console.log('NestJS server is running'));
