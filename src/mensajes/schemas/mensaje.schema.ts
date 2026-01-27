import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Mensaje extends Document {
  @Prop({ required: true })
  nombre: string;  

  @Prop({ required: true })
  email: string; 

  @Prop({ required: true })
  mensaje: string; 

  @Prop({ default: Date.now })
  fecha: Date; 
}

export const MensajeSchema = SchemaFactory.createForClass(Mensaje);
