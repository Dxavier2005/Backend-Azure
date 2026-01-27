import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('libros')
export class Libro {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  titulo: string;

  @Column({ nullable: true })
  autor: string;

  @Column({ nullable: true })
  anio_publicacion: number;

  @Column({ nullable: true })
  numero_paginas: number;

  @Column()
  cantidad_disponible: number;

  @Column({ nullable: true })
  categoria_id: string;

  @Column({ nullable: true })
  editorial_id: string;

  @Column({ nullable: true })
  idioma_id: string;

  @Column({ nullable: true })
  tipo_libro_id: string;

  @Column({ nullable: true })
  estado_id: string;
}
