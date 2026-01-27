import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Libro } from './libros.entity';
import { CreateLibroDto } from './dto/create-libro.dto';
import { UpdateLibroDto } from './dto/update-libro.dto';
import { QueryDto } from 'src/common/dto/query.dto';

@Injectable()
export class LibrosService {
  constructor(
    @InjectRepository(Libro)
    private readonly repository: Repository<Libro>,
  ) {}

  async create(dto: CreateLibroDto): Promise<Libro | null> {
    try {
      const libro = this.repository.create(dto);
      return await this.repository.save(libro);
    } catch (err) {
      console.error('Error creating libro:', err);
      return null;
    }
  }

  async findAll(queryDto: QueryDto): Promise<Pagination<Libro> | null> {
    try {
      const { page, limit, search, searchField, sort, order } = queryDto;

      const query = this.repository.createQueryBuilder('libro');

      if (search) {
        if (searchField) {
          if (searchField === 'titulo') {
            query.where('libro.titulo ILIKE :search', {
              search: `%${search}%`,
            });
          }
        } else {
          query.where('libro.titulo ILIKE :search', {
            search: `%${search}%`,
          });
        }
      }

      if (sort) {
        const validFields = ['titulo', 'anio_publicacion', 'stock'];
        const sortField = validFields.includes(sort) ? sort : 'titulo';
        const sortOrder = order === 'ASC' || order === 'DESC' ? order : 'ASC';
        query.orderBy(`libro.${sortField}`, sortOrder);
      }

      return await paginate<Libro>(query, { page, limit });
    } catch (err) {
      console.error('Error fetching libros:', err);
      return null;
    }
  }

  async findOne(id: string): Promise<Libro | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async update(id: string, dto: UpdateLibroDto): Promise<Libro | null> {
    const entity = await this.findOne(id);
    if (!entity) return null;
    Object.assign(entity, dto);
    return await this.repository.save(entity);
  }

  async remove(id: string): Promise<Libro | null> {
    const entity = await this.findOne(id);
    if (!entity) return null;
    return await this.repository.remove(entity);
  }
}
