import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import configuration from './config/configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true })
  );
  app.enableCors({ origin: configuration().server.cors_origins.split(',') });
  await app.listen(configuration().server.port);
  console.log(`running on: ${await app.getUrl()}`);
}
bootstrap();
