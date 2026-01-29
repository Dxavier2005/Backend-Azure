import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('editoriales')
export class Editorial {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  pais: string;
}
