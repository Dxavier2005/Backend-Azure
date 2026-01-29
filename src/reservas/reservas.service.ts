import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Reserva } from './reserva.entity';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { QueryDto } from 'src/common/dto/query.dto';

@Injectable()
export class ReservasService {
  constructor(
    @InjectRepository(Reserva)
    private readonly repository: Repository<Reserva>,
  ) {}

  async create(dto: CreateReservaDto): Promise<Reserva | null> {
    try {
      const reserva = this.repository.create(dto);
      return await this.repository.save(reserva);
    } catch (err) {
      console.error('Error creating reserva:', err);
      return null;
    }
  }

  async findAll(queryDto: QueryDto): Promise<Pagination<Reserva> | null> {
    try {
      const { page, limit, search, searchField, sort, order } = queryDto;

      const query = this.repository.createQueryBuilder('reserva');

      if (search) {
        if (searchField) {
          switch (searchField) {
            case 'usuario_id':
              query.where('reserva.usuario_id ILIKE :search', {
                search: `%${search}%`,
              });
              break;
            case 'libro_id':
              query.where('reserva.libro_id ILIKE :search', {
                search: `%${search}%`,
              });
              break;
            case 'estado':
              query.where('reserva.estado ILIKE :search', {
                search: `%${search}%`,
              });
              break;
            default:
              query.where(
                '(reserva.usuario_id ILIKE :search OR reserva.libro_id ILIKE :search OR reserva.estado ILIKE :search)',
                { search: `%${search}%` },
              );
          }
        } else {
          query.where(
            '(reserva.usuario_id ILIKE :search OR reserva.libro_id ILIKE :search OR reserva.estado ILIKE :search)',
            { search: `%${search}%` },
          );
        }
      }

      if (sort) {
        const validFields = ['usuario_id', 'libro_id', 'fecha_reserva', 'estado'];
        const sortField = validFields.includes(sort) ? sort : 'fecha_reserva';
        const sortOrder = order === 'ASC' || order === 'DESC' ? order : 'ASC';
        query.orderBy(`reserva.${sortField}`, sortOrder);
      }

      return await paginate<Reserva>(query, { page, limit });
    } catch (err) {
      console.error('Error fetching reservas:', err);
      return null;
    }
  }

  findOne(id: string) {
    return this.repository.findOne({ where: { id } });
  }

  async update(id: string, dto: UpdateReservaDto) {
    const entity = await this.findOne(id);
    if (!entity) return null;
    Object.assign(entity, dto);
    return this.repository.save(entity);
  }

  async remove(id: string) {
    const entity = await this.findOne(id);
    if (!entity) return null;
    return this.repository.remove(entity);
  }
}
