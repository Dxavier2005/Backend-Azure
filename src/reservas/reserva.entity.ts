import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('reservas')
export class Reserva {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  usuario_id: string;

  @Column()
  libro_id: string;

  @Column()
  fecha_reserva: Date;

  @Column()
  estado: string;
}
