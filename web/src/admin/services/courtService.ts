import { api } from '../../api/client';

export type Court = { id: number; name: string; cityId: number };

export async function getCourts(cityId?: number): Promise<Court[]> {
  const res = await api.get('/api/courts', { params: cityId ? { cityId } : {} });
  return res.data;
}

export async function createCourt(name: string, cityId: number): Promise<Court> {
  const res = await api.post('/api/admin/courts', { name, cityId });
  return res.data;
}

export async function updateCourt(id: number, name: string, cityId: number): Promise<Court> {
  const res = await api.put(`/api/admin/courts/${id}`, { name, cityId });
  return res.data;
}

export async function deleteCourt(id: number): Promise<void> {
  await api.delete(`/api/admin/courts/${id}`);
}
