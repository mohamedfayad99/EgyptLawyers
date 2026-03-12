import { api, toErrorMessage } from './api';
import { City, Court, LawyerProfile, LawyerPublicProfile, HelpPost, HelpPostDetails, AppNotification } from './types';

// ============== Auth Services ==============
export async function registerLawyer(data: {
  fullName: string;
  professionalTitle?: string;
  syndicateCardNumber: string;
  nationalIdNumber?: string;
  whatsappNumber: string;
  password: string;
  activeCityIds: number[];
  profileImageBase64?: string;
  idCardImageBase64?: string;
}) {
  try {
    const res = await api.post('/lawyers/register', {
      fullName: data.fullName,
      professionalTitle: data.professionalTitle || null,
      syndicateCardNumber: data.syndicateCardNumber,
      nationalIdNumber: data.nationalIdNumber,
      whatsappNumber: data.whatsappNumber,
      password: data.password,
      activeCityIds: data.activeCityIds,
      profileImageBase64: data.profileImageBase64,
      idCardImageBase64: data.idCardImageBase64,
    });
    return res.data;
  } catch (e) {
    throw new Error(toErrorMessage(e, 'Registration failed'));
  }
}

export async function loginLawyer(whatsappNumber: string, password: string) {
  try {
    const res = await api.post('/lawyers/login', {
      whatsappNumber,
      password,
    });
    return res.data;
  } catch (e) {
    throw new Error(toErrorMessage(e, 'Login failed'));
  }
}

export async function getLawyerProfile(): Promise<LawyerProfile> {
  try {
    const res = await api.get('/lawyers/me');
    return res.data;
  } catch (e) {
    throw new Error(toErrorMessage(e, 'Failed to load profile'));
  }
}

export async function updateLawyerProfile(data: {
  fullName: string;
  professionalTitle?: string;
  syndicateCardNumber?: string;
  nationalIdNumber?: string;
  whatsappNumber: string;
  activeCityIds: number[];
  profileImageBase64?: string;
  idCardImageBase64?: string;
}) {
  try {
    const res = await api.put('/lawyers/me', {
      fullName: data.fullName,
      professionalTitle: data.professionalTitle || null,
      syndicateCardNumber: data.syndicateCardNumber,
      nationalIdNumber: data.nationalIdNumber,
      whatsappNumber: data.whatsappNumber,
      activeCityIds: data.activeCityIds,
      profileImageBase64: data.profileImageBase64,
      idCardImageBase64: data.idCardImageBase64,
    });
    return res.data;
  } catch (e) {
    throw new Error(toErrorMessage(e, 'Failed to update profile'));
  }
}

export async function getLawyerById(id: string): Promise<LawyerPublicProfile> {
  try {
    const res = await api.get(`/lawyers/${id}`);
    return res.data;
  } catch (e) {
    throw new Error(toErrorMessage(e, 'Failed to load lawyer profile'));
  }
}

export async function registerDevice(deviceToken: string, platform?: string) {
  try {
    const platformValue = platform?.toLowerCase() === 'ios' ? 1 : platform?.toLowerCase() === 'android' ? 2 : 0;
    await api.post('/lawyers/devices', { 
      DeviceToken: deviceToken, 
      Platform: platformValue 
    });
  } catch (e) {
    // Silently fail – push notifications are a non-blocking feature
    console.warn('Device registration failed:', e);
  }
}

// ============== Lookup Services ==============
export async function getCities(): Promise<City[]> {
  try {
    const res = await api.get('/cities');
    return res.data;
  } catch (e) {
    throw new Error(toErrorMessage(e, 'Failed to load cities'));
  }
}

export async function getCourts(cityId: number): Promise<Court[]> {
  try {
    const res = await api.get(`/cities/${cityId}/courts`);
    return res.data;
  } catch (e) {
    throw new Error(toErrorMessage(e, 'Failed to load courts'));
  }
}

// ============== Help Post Services ==============
export async function createHelpPost(courtId: number, description: string, files: any[] = []) {
  try {
    const formData = new FormData();
    formData.append('courtId', courtId.toString());
    formData.append('description', description);

    files.forEach((file, index) => {
      formData.append('files', {
        uri: file.uri,
        name: file.name || `file_${index}`,
        type: file.mimeType || file.type || 'application/octet-stream',
      } as any);
    });

    const res = await api.post('/help-posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  } catch (e) {
    throw new Error(toErrorMessage(e, 'Failed to create post'));
  }
}

export async function getHelpPosts(
  cityId?: number,
  courtId?: number,
): Promise<HelpPost[]> {
  try {
    const params: Record<string, any> = {};
    if (cityId) params.cityId = cityId;
    if (courtId) params.courtId = courtId;

    const res = await api.get('/help-posts', { params });
    return res.data;
  } catch (e) {
    throw new Error(toErrorMessage(e, 'Failed to load posts'));
  }
}

export async function getHelpPostDetails(id: string): Promise<HelpPostDetails> {
  try {
    const res = await api.get(`/help-posts/${id}`);
    return res.data;
  } catch (e) {
    throw new Error(toErrorMessage(e, 'Failed to load post'));
  }
}

export async function replyToHelpPost(id: string, message: string, files: any[] = []) {
  try {
    const formData = new FormData();
    formData.append('message', message);

    files.forEach((file, index) => {
      formData.append('files', {
        uri: file.uri,
        name: file.name || `reply_file_${index}`,
        type: file.mimeType || file.type || 'application/octet-stream',
      } as any);
    });

    const res = await api.post(`/help-posts/${id}/replies`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  } catch (e) {
    throw new Error(toErrorMessage(e, 'Failed to send reply'));
  }
}

export async function rateReply(postId: string, replyId: string, rating: number) {
  try {
    await api.post(`/help-posts/${postId}/replies/${replyId}/rate`, {
      rating,
    });
  } catch (e) {
    throw new Error(toErrorMessage(e, 'Failed to rate reply'));
  }
}

export async function deleteReply(postId: string, replyId: string) {
  try {
    await api.delete(`/help-posts/${postId}/replies/${replyId}`);
  } catch (e) {
    throw new Error(toErrorMessage(e, 'Failed to delete reply'));
  }
}

// ============== Notification Services ==============
export async function getNotifications(): Promise<AppNotification[]> {
  try {
    const res = await api.get('/notifications');
    return res.data;
  } catch (e) {
    throw new Error(toErrorMessage(e, 'Failed to load notifications'));
  }
}

export async function markNotificationAsRead(id: string) {
  try {
    await api.put(`/notifications/${id}/read`);
  } catch (e) {
    // Best effort
  }
}

export async function deleteNotification(id: string) {
  try {
    await api.delete(`/notifications/${id}`);
  } catch (e) {
    throw new Error(toErrorMessage(e, 'Failed to delete notification'));
  }
}
