import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Multa } from './multa.entity';
import { CreateMultaDto } from './dto/create-multa.dto';
import { UpdateMultaDto } from './dto/update-multa.dto';
import { QueryDto } from 'src/common/dto/query.dto';

@Injectable()
export class MultasService {
  constructor(
    @InjectRepository(Multa)
    private readonly repository: Repository<Multa>,
  ) {}

  async create(dto: CreateMultaDto): Promise<Multa | null> {
    try {
      const multa = this.repository.create(dto);
      return await this.repository.save(multa);
    } catch (err) {
      console.error('Error creating multa:', err);
      return null;
    }
  }

  async findAll(queryDto: QueryDto): Promise<Pagination<Multa> | null> {
    try {
      const { page, limit, search, searchField, sort, order } = queryDto;

      const query = this.repository.createQueryBuilder('multa');

      if (search) {
        if (searchField) {
          switch (searchField) {
            case 'monto':
              query.where('multa.monto = :search', { search: Number(search) });
              break;
            case 'pagado':
              const pagadoValue = search.toLowerCase() === 'true';
              query.where('multa.pagado = :search', { search: pagadoValue });
              break;
            case 'prestamo_id':
              query.where('multa.prestamo_id ILIKE :search', {
                search: `%${search}%`,
              });
              break;
            default:
              query.where('multa.prestamo_id ILIKE :search', {
                search: `%${search}%`,
              });
          }
        } else {
          query.where('multa.prestamo_id ILIKE :search', {
            search: `%${search}%`,
          });
        }
      }

      if (sort) {
        const validFields = ['monto', 'pagado', 'prestamo_id'];
        const sortField = validFields.includes(sort) ? sort : 'monto';
        const sortOrder = order === 'ASC' || order === 'DESC' ? order : 'ASC';
        query.orderBy(`multa.${sortField}`, sortOrder);
      }

      return await paginate<Multa>(query, { page, limit });
    } catch (err) {
      console.error('Error fetching multas:', err);
      return null;
    }
  }

  findOne(id: string) {
    return this.repository.findOne({ where: { id } });
  }

  async update(id: string, dto: UpdateMultaDto) {
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
