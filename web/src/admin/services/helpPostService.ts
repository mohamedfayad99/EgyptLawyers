import { api } from '../../api/client';

export type HelpPost = {
  id: string;
  cityId: number;
  courtId: number;
  description: string;
  status: string | number;
  createdAtUtc: string;
  lawyerId: string;
};

export async function getHelpPosts(cityId?: number, courtId?: number): Promise<HelpPost[]> {
  const params: Record<string, number> = {};
  if (cityId) params.cityId = cityId;
  if (courtId) params.courtId = courtId;
  const res = await api.get('/api/help-posts', { params });
  return res.data;
}
