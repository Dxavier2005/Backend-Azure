import api from './axios';

export function login(username: string, password: string) {
  return api.post<{ access_token: string }>('/auth/login', { username, password });
}

export function register(payload: { username: string; email: string; password: string }) {
  return api.post<{ access_token: string }>('/auth/register', payload);
}
