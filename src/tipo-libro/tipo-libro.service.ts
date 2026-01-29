import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { TipoLibro } from './tipo-libro.entity';
import { CreateTipoLibroDto } from './dto/create-tipo-libro.dto';
import { UpdateTipoLibroDto } from './dto/update-tipo-libro.dto';
import { QueryDto } from 'src/common/dto/query.dto';

@Injectable()
export class TipoLibroService {
  constructor(
    @InjectRepository(TipoLibro)
    private readonly repository: Repository<TipoLibro>,
  ) {}

  async create(dto: CreateTipoLibroDto): Promise<TipoLibro | null> {
    try {
      const tipoLibro = this.repository.create(dto);
      return await this.repository.save(tipoLibro);
    } catch (err) {
      console.error('Error creating tipo libro:', err);
      return null;
    }
  }

  async findAll(queryDto: QueryDto): Promise<Pagination<TipoLibro> | null> {
    try {
      const { page, limit, search, searchField, sort, order } = queryDto;

      const query = this.repository.createQueryBuilder('tipo_libro');

      if (search) {
        if (searchField) {
          if (searchField === 'nombre') {
            query.where('tipo_libro.nombre ILIKE :search', {
              search: `%${search}%`,
            });
          }
        } else {
          query.where('tipo_libro.nombre ILIKE :search', {
            search: `%${search}%`,
          });
        }
      }

      if (sort) {
        const sortField = sort === 'nombre' ? sort : 'nombre';
        const sortOrder = order === 'ASC' || order === 'DESC' ? order : 'ASC';
        query.orderBy(`tipo_libro.${sortField}`, sortOrder);
      }

      return await paginate<TipoLibro>(query, { page, limit });
    } catch (err) {
      console.error('Error fetching tipos libro:', err);
      return null;
    }
  }

  findOne(id: string) {
    return this.repository.findOne({ where: { id } });
  }

  async update(id: string, dto: UpdateTipoLibroDto) {
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
