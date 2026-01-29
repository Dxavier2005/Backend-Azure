import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Prestamo } from './prestamos.entity';
import { CreatePrestamoDto } from './dto/create-prestamos.dto';
import { UpdatePrestamoDto } from './dto/update-prestamos.dto';
import { QueryDto } from 'src/common/dto/query.dto';

@Injectable()
export class PrestamosService {
  constructor(
    @InjectRepository(Prestamo)
    private readonly repository: Repository<Prestamo>,
  ) {}

  async create(dto: CreatePrestamoDto): Promise<Prestamo | null> {
    try {
      const prestamo = this.repository.create(dto);
      return await this.repository.save(prestamo);
    } catch (err) {
      console.error('Error creating prestamo:', err);
      return null;
    }
  }

  async findAll(queryDto: QueryDto): Promise<Pagination<Prestamo> | null> {
    try {
      const { page, limit, search, searchField, sort, order } = queryDto;

      const query = this.repository.createQueryBuilder('prestamo');

      if (search) {
        if (searchField) {
          switch (searchField) {
            case 'usuario_id':
              query.where('prestamo.usuario_id ILIKE :search', {
                search: `%${search}%`,
              });
              break;
            case 'libro_id':
              query.where('prestamo.libro_id ILIKE :search', {
                search: `%${search}%`,
              });
              break;
            case 'estado':
              query.where('prestamo.estado ILIKE :search', {
                search: `%${search}%`,
              });
              break;
            default:
              query.where(
                '(prestamo.usuario_id ILIKE :search OR prestamo.libro_id ILIKE :search OR prestamo.estado ILIKE :search)',
                { search: `%${search}%` },
              );
          }
        } else {
          query.where(
            '(prestamo.usuario_id ILIKE :search OR prestamo.libro_id ILIKE :search OR prestamo.estado ILIKE :search)',
            { search: `%${search}%` },
          );
        }
      }

      if (sort) {
        const validFields = ['usuario_id', 'libro_id', 'fecha_prestamo', 'fecha_devolucion', 'estado'];
        const sortField = validFields.includes(sort) ? sort : 'fecha_prestamo';
        const sortOrder = order === 'ASC' || order === 'DESC' ? order : 'ASC';
        query.orderBy(`prestamo.${sortField}`, sortOrder);
      }

      return await paginate<Prestamo>(query, { page, limit });
    } catch (err) {
      console.error('Error fetching prestamos:', err);
      return null;
    }
  }

  findOne(id: string) {
    return this.repository.findOne({ where: { id } });
  }

  async update(id: string, dto: UpdatePrestamoDto) {
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
