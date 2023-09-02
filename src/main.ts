import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import configuration from './config/configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true })
  );
  // app.enableCors({ origin: configuration().server.cors_origins.split(',') });
  app.enableCors({ origin: '*' });

  const config = new DocumentBuilder()
    .setTitle('ЯПомогаю')
    .setDescription('API')
    .setVersion('0.1')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api', app, document);

  await app.listen(configuration().server.port);

  console.info(`running on: ${await app.getUrl()}`);
}
bootstrap();
