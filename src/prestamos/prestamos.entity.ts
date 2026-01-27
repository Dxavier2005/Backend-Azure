import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('prestamos')
export class Prestamo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  usuario_id: string;

  @Column()
  libro_id: string;

  @Column()
  fecha_prestamo: Date;

  @Column({ nullable: true })
  fecha_devolucion: Date;

  @Column()
  estado: string;
}
