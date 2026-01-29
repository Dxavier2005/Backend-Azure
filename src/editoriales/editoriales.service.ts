import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Editorial } from './editorial.entity';
import { CreateEditorialDto } from './dto/create-editorial-dto';
import { UpdateEditorialDto } from './dto/update-editorial.dto';
import { QueryDto } from 'src/common/dto/query.dto';

@Injectable()
export class EditorialesService {
  constructor(
    @InjectRepository(Editorial)
    private readonly repository: Repository<Editorial>,
  ) {}

  async create(dto: CreateEditorialDto): Promise<Editorial | null> {
    try {
      const editorial = this.repository.create(dto);
      return await this.repository.save(editorial);
    } catch (err) {
      console.error('Error creating editorial:', err);
      return null;
    }
  }

  async findAll(queryDto: QueryDto): Promise<Pagination<Editorial> | null> {
    try {
      const { page, limit, search, searchField, sort, order } = queryDto;

      const query = this.repository.createQueryBuilder('editorial');

      if (search) {
        if (searchField) {
          switch (searchField) {
            case 'nombre':
              query.where('editorial.nombre ILIKE :search', {
                search: `%${search}%`,
              });
              break;
            case 'pais':
              query.where('editorial.pais ILIKE :search', {
                search: `%${search}%`,
              });
              break;
            default:
              query.where(
                '(editorial.nombre ILIKE :search OR editorial.pais ILIKE :search)',
                { search: `%${search}%` },
              );
          }
        } else {
          query.where(
            '(editorial.nombre ILIKE :search OR editorial.pais ILIKE :search)',
            { search: `%${search}%` },
          );
        }
      }

      if (sort) {
        const sortField = sort === 'nombre' || sort === 'pais' ? sort : 'nombre';
        const sortOrder = order === 'ASC' || order === 'DESC' ? order : 'ASC';
        query.orderBy(`editorial.${sortField}`, sortOrder);
      }

      return await paginate<Editorial>(query, { page, limit });
    } catch (err) {
      console.error('Error fetching editorials:', err);
      return null;
    }
  }

  findOne(id: string) {
    return this.repository.findOne({ where: { id } });
  }

  async update(id: string, dto: UpdateEditorialDto) {
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
