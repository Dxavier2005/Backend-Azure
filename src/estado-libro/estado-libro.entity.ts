import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('estado_libro')
export class EstadoLibro {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;
}
