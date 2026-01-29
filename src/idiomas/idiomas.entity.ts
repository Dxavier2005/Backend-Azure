import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('idiomas')
export class Idioma {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  codigo: string;
}
