import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Categoria } from './categories.entity';
import { CreateCategoriesDto } from './dto/create-categories.dto';
import { UpdateCategoriesDto } from './dto/update-categories.dto';
import { QueryDto } from 'src/common/dto/query.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Categoria)
    private readonly repository: Repository<Categoria>,
  ) {}

  async create(dto: CreateCategoriesDto): Promise<Categoria | null> {
    try {
      const category = this.repository.create(dto);
      return await this.repository.save(category);
    } catch (err) {
      console.error('Error creating category:', err);
      return null;
    }
  }

  async findAll(queryDto: QueryDto): Promise<Pagination<Categoria> | null> {
    try {
      const { page, limit, search, searchField, sort, order } = queryDto;

      const query = this.repository.createQueryBuilder('categoria');

      if (search) {
        if (searchField) {
          switch (searchField) {
            case 'nombre':
              query.where('categoria.nombre ILIKE :search', {
                search: `%${search}%`,
              });
              break;
            case 'descripcion':
              query.where('categoria.descripcion ILIKE :search', {
                search: `%${search}%`,
              });
              break;
            default:
              query.where(
                '(categoria.nombre ILIKE :search OR categoria.descripcion ILIKE :search)',
                { search: `%${search}%` },
              );
          }
        } else {
          query.where(
            '(categoria.nombre ILIKE :search OR categoria.descripcion ILIKE :search)',
            { search: `%${search}%` },
          );
        }
      }

      if (sort) {
        query.orderBy(`categoria.${sort}`, (order ?? 'ASC') as 'ASC' | 'DESC');
      }

      return await paginate<Categoria>(query, { page, limit });
    } catch (err) {
      console.error('Error retrieving categories:', err);
      return null;
    }
  }

  async findOne(id: string): Promise<Categoria | null> {
    try {
      return await this.repository.findOne({ where: { id } });
    } catch (err) {
      console.error('Error finding category:', err);
      return null;
    }
  }

  async update(
    id: string,
    dto: UpdateCategoriesDto,
  ): Promise<Categoria | null> {
    try {
      const category = await this.findOne(id);
      if (!category) return null;

      Object.assign(category, dto);
      return await this.repository.save(category);
    } catch (err) {
      console.error('Error updating category:', err);
      return null;
    }
  }

  async remove(id: string): Promise<Categoria | null> {
    try {
      const category = await this.findOne(id);
      if (!category) return null;

      return await this.repository.remove(category);
    } catch (err) {
      console.error('Error deleting category:', err);
      return null;
    }
  }
}
