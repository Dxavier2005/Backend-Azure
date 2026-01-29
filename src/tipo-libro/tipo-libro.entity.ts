import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tipo_libro')
export class TipoLibro {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  descripcion: string;
}
