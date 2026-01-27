import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { EstadoLibro } from './estado-libro.entity';
import { CreateEstadoLibroDto } from './dto/create-estado-libro.dto';
import { UpdateEstadoLibroDto } from './dto/update-estado-libro.dto';
import { QueryDto } from 'src/common/dto/query.dto';

@Injectable()
export class EstadoLibroService {
  constructor(
    @InjectRepository(EstadoLibro)
    private readonly repository: Repository<EstadoLibro>,
  ) {}

  async create(dto: CreateEstadoLibroDto): Promise<EstadoLibro | null> {
    try {
      const estadoLibro = this.repository.create(dto);
      return await this.repository.save(estadoLibro);
    } catch (err) {
      console.error('Error creating estado libro:', err);
      return null;
    }
  }

  async findAll(queryDto: QueryDto): Promise<Pagination<EstadoLibro> | null> {
    try {
      const { page, limit, search, searchField, sort, order } = queryDto;

      const query = this.repository.createQueryBuilder('estado_libro');

      if (search) {
        if (searchField) {
          if (searchField === 'nombre') {
            query.where('estado_libro.nombre ILIKE :search', {
              search: `%${search}%`,
            });
          }
        } else {
          query.where('estado_libro.nombre ILIKE :search', {
            search: `%${search}%`,
          });
        }
      }

      if (sort) {
        const sortField = sort === 'nombre' ? sort : 'nombre';
        const sortOrder = order === 'ASC' || order === 'DESC' ? order : 'ASC';
        query.orderBy(`estado_libro.${sortField}`, sortOrder);
      }

      return await paginate<EstadoLibro>(query, { page, limit });
    } catch (err) {
      console.error('Error fetching estados libro:', err);
      return null;
    }
  }

  findOne(id: string) {
    return this.repository.findOne({ where: { id } });
  }

  async update(id: string, dto: UpdateEstadoLibroDto) {
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
