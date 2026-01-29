import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Comentario extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  contenido: string;

  @Prop({ default: Date.now })
  fecha: Date;
}

export const ComentarioSchema = SchemaFactory.createForClass(Comentario);
