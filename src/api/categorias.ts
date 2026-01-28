import api from './axios';

export type Categoria = {
  id: string;
  nombre: string;
  descripcion?: string;
};

export type Pagination<T> = {
  items: T[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
};

export function listCategorias(params: { page?: number; limit?: number }) {
  return api.get<Pagination<Categoria>>('/categorias', { params });
}

export function createCategoria(data: Partial<Categoria>) {
  return api.post<Categoria>('/categorias', data);
}

export function updateCategoria(id: string, data: Partial<Categoria>) {
  return api.patch<Categoria>(`/categorias/${id}`, data);
}

export function deleteCategoria(id: string) {
  return api.delete(`/categorias/${id}`);
}
