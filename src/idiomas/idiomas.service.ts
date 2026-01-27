import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Idioma } from './idiomas.entity';
import { CreateIdiomaDto } from './dto/create-idioma.dto';
import { UpdateIdiomaDto } from './dto/update-idioma.dto';
import { QueryDto } from 'src/common/dto/query.dto';

@Injectable()
export class IdiomasService {
  constructor(
    @InjectRepository(Idioma)
    private readonly repository: Repository<Idioma>,
  ) {}

  async create(dto: CreateIdiomaDto): Promise<Idioma | null> {
    try {
      const idioma = this.repository.create(dto);
      return await this.repository.save(idioma);
    } catch (err) {
      console.error('Error creating idioma:', err);
      return null;
    }
  }

  async findAll(queryDto: QueryDto): Promise<Pagination<Idioma> | null> {
    try {
      const { page, limit, search, searchField, sort, order } = queryDto;

      const query = this.repository.createQueryBuilder('idioma');

      if (search) {
        if (searchField) {
          if (searchField === 'nombre') {
            query.where('idioma.nombre ILIKE :search', {
              search: `%${search}%`,
            });
          }
        } else {
          query.where('idioma.nombre ILIKE :search', {
            search: `%${search}%`,
          });
        }
      }

      if (sort) {
        const sortField = sort === 'nombre' ? sort : 'nombre';
        const sortOrder = order === 'ASC' || order === 'DESC' ? order : 'ASC';
        query.orderBy(`idioma.${sortField}`, sortOrder);
      }

      return await paginate<Idioma>(query, { page, limit });
    } catch (err) {
      console.error('Error fetching idiomas:', err);
      return null;
    }
  }

  findOne(id: string) {
    return this.repository.findOne({ where: { id } });
  }

  async update(id: string, dto: UpdateIdiomaDto) {
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
