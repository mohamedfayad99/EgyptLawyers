import { api } from '../../api/client';

export type HelpPost = {
  id: string;
  cityId: number;
  cityName?: string;
  courtId: number;
  courtName?: string;
  description: string;
  status: string | number;
  createdAtUtc: string;
  lawyerId: string;
  lawyerName?: string;
  lawyerWhatsapp?: string;
  replies?: Comment[];
};

export type Comment = {
  id: string;
  text?: string;
  message?: string;
  authorName?: string;
  lawyerName?: string;
  createdAtUtc: string;
  replies?: Comment[];
};

export async function getHelpPosts(cityId?: number, courtId?: number): Promise<HelpPost[]> {
  const res = await api.get('/api/help-posts', {
    params: { cityId, courtId },
  });
  return res.data;
}

export async function getHelpPost(postId: string): Promise<HelpPost> {
  const res = await api.get(`/api/help-posts/${postId}`);
  return res.data;
}


export async function deleteHelpPost(postId: string): Promise<void> {
  await api.delete(`/api/help-posts/${postId}`);
}
