import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('categorias')
export class Categoria {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  descripcion: string;
}
