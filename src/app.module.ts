import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { LibrosModule } from './libros/libros.module';
import { PrestamosModule } from './prestamos/prestamos.module';
import { MultasModule } from './multas/multas.module';
import { ReservasModule } from './reservas/reservas.module';
import { EditorialesModule } from './editoriales/editoriales.module';
import { IdiomasModule } from './idiomas/idiomas.module';
import { TipoLibroModule } from './tipo-libro/tipo-libro.module';
import { EstadoLibroModule } from './estado-libro/estado-libro.module';
import { ComentariosModule } from './comentarios/comentarios.module';
import { MensajesModule } from './mensajes/mensajes.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI || ''),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      //ssl: { rejectUnauthorized: false },
    }),
    AuthModule,
    UsersModule,
    CategoriesModule,
    LibrosModule,
    PrestamosModule,
    MultasModule,
    ReservasModule,
    EditorialesModule,
    IdiomasModule,
    TipoLibroModule,
    EstadoLibroModule,
    ComentariosModule,
    MensajesModule,    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}