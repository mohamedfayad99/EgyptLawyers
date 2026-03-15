import { api } from '../../api/client';

export type City = { id: number; name: string };
export type CityDetailed = City & { lawyersCount: number; courtsCount: number };

export async function getCities(): Promise<City[]> {
  const res = await api.get('/api/cities');
  return res.data;
}

export async function getDetailedCities(): Promise<CityDetailed[]> {
  const res = await api.get('/api/admin/cities/details');
  return res.data;
}

export async function createCity(name: string): Promise<City> {
  const res = await api.post('/api/admin/cities', { name });
  return res.data;
}

export async function updateCity(id: number, name: string): Promise<City> {
  const res = await api.put(`/api/admin/cities/${id}`, { name });
  return res.data;
}

export async function deleteCity(id: number): Promise<void> {
  await api.delete(`/api/admin/cities/${id}`);
}
