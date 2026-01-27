import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MensajesController } from './mensajes.controller';
import { MensajesService } from './mensajes.service';
import { Mensaje, MensajeSchema } from './schemas/mensaje.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Mensaje.name, schema: MensajeSchema },
    ]),
  ],
  controllers: [MensajesController],
  providers: [MensajesService],
})
export class MensajesModule {}
