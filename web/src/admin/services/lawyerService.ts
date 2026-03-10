import { api } from '../../api/client';

export type Lawyer = {
  id: string;
  fullName: string;
  professionalTitle?: string | null;
  syndicateCardNumber: string;
  whatsappNumber: string;
  verificationStatus: 'Pending' | 'Approved' | 'Rejected' | number;
  isSuspended: boolean;
  createdAtUtc: string;
  activeCities?: string[];
};

export async function getLawyers(status?: string): Promise<Lawyer[]> {
  const res = await api.get('/api/admin/lawyers', {
    params: status ? { status } : {},
  });
  return res.data;
}

export async function approveLawyer(id: string): Promise<void> {
  await api.patch(`/api/admin/lawyers/${id}/approve`);
}

export async function rejectLawyer(id: string): Promise<void> {
  await api.patch(`/api/admin/lawyers/${id}/reject`);
}

export async function suspendLawyer(id: string, suspended: boolean): Promise<void> {
  await api.patch(`/api/admin/lawyers/${id}/suspend`, null, { params: { suspended } });
}

export async function deleteLawyer(id: string): Promise<void> {
  await api.delete(`/api/admin/lawyers/${id}`);
}
