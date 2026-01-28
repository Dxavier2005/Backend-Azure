import api from './axios';
import { Pagination } from './categorias';

export type Libro = {
	id: string;
	titulo: string;
	autor?: string;
	cantidad_disponible: number;
	categoria_id?: string;
};

export function listLibros(params: { page?: number; limit?: number; search?: string; searchField?: string }) {
	return api.get<Pagination<Libro>>('/libros', { params });
}

export function getLibro(id: string) {
	return api.get<Libro>(`/libros/${id}`);
}

export function createLibro(data: Partial<Libro>) {
	return api.post<Libro>('/libros', data);
}

export function updateLibro(id: string, data: Partial<Libro>) {
	return api.patch<Libro>(`/libros/${id}`, data);
}

export function deleteLibro(id: string) {
	return api.delete(`/libros/${id}`);
}

export { Pagination };
