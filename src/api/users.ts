import api from './axios';
import { User } from '../context/AuthContext';

export type { User };

export function getUser(id: string) {
  return api.get<User>(`/users/${id}`);
}

export function updateUser(id: string, data: Partial<User>) {
  return api.patch<User>(`/users/${id}`, data);
}

export function uploadProfile(id: string, file: File) {
  const formData = new FormData();
  formData.append('file', file);
  return api.post(`/users/${id}/profile`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}
