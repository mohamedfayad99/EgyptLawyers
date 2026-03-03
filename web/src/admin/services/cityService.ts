import { api } from '../../api/client';

export type City = { id: number; name: string };

export async function getCities(): Promise<City[]> {
  const res = await api.get('/api/cities');
  return res.data;
}

export async function createCity(name: string): Promise<City> {
  const res = await api.post('/api/admin/cities', { name });
  return res.data;
}
