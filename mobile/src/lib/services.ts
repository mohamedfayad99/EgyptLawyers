import { api, toErrorMessage } from './api';
import { City, Court, LawyerProfile, LawyerPublicProfile, HelpPost, HelpPostDetails } from './types';

// ============== Auth Services ==============
export async function registerLawyer(data: {
  fullName: string;
  professionalTitle?: string;
  syndicateCardNumber: string;
  whatsappNumber: string;
  password: string;
  activeCityIds: number[];
}) {
  try {
    const res = await api.post('/lawyers/register', {
      fullName: data.fullName,
      professionalTitle: data.professionalTitle || null,
      syndicateCardNumber: data.syndicateCardNumber,
      whatsappNumber: data.whatsappNumber,
      password: data.password,
      activeCityIds: data.activeCityIds,
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
    await api.post('/lawyers/devices', { deviceToken, platform });
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
export async function createHelpPost(courtId: number, description: string) {
  try {
    const res = await api.post('/help-posts', {
      courtId,
      description,
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

export async function replyToHelpPost(id: string, message: string) {
  try {
    const res = await api.post(`/help-posts/${id}/replies`, {
      message,
    });
    return res.data;
  } catch (e) {
    throw new Error(toErrorMessage(e, 'Failed to send reply'));
  }
}
