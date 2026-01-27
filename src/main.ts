import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { AppModule } from './app.module';
import { GlobalHttpExceptionFilter } from './common/filters/http-exception.filter';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);


  const port = process.env.PORT || 3000;


  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:3001',
     
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });


  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );


  app.useGlobalFilters(new GlobalHttpExceptionFilter());


  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/public',
  });


  await app.listen(port);
  console.log(` Backend corriendo en el puerto ${port}`);
}


bootstrap();

