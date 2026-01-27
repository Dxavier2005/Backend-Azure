import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Mensaje } from './schemas/mensaje.schema';
import { CreateMensajeDto } from './dto/create-mensaje.dto';

@Injectable()
export class MensajesService {
  constructor(
    @InjectModel(Mensaje.name)
    private readonly mensajeModel: Model<Mensaje>,
  ) {}

  async create(dto: CreateMensajeDto): Promise<Mensaje | null> {
    try {
      const mensaje = new this.mensajeModel(dto);
      return await mensaje.save();
    } catch (error) {
      console.error('Error creating message:', error);
      return null;
    }
  }

  async findAll(options: { page: number; limit: number }): Promise<any | null> {
    try {
      const { page, limit } = options;

      const mensajes = await this.mensajeModel
        .find()
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ fecha: -1 });

      return { items: mensajes, page, limit };
    } catch (error) {
      console.error('Error retrieving messages:', error);
      return null;
    }
  }

  async findOne(id: string): Promise<Mensaje | null> {
    try {
      return await this.mensajeModel.findById(id);
    } catch (error) {
      console.error('Error finding message:', error);
      return null;
    }
  }

  async remove(id: string): Promise<Mensaje | null> {
    try {
      return await this.mensajeModel.findByIdAndDelete(id);
    } catch (error) {
      console.error('Error deleting message:', error);
      return null;
    }
  }
}
