export type City = { id: number; name: string };
export type Court = { id: number; name: string; cityId: number };

export type LawyerProfile = {
  id: string;
  fullName: string;
  professionalTitle?: string | null;
  syndicateCardNumber: string;
  whatsappNumber: string;
  verificationStatus: string | number;
  isSuspended: boolean;
  activeCities?: City[];
};

export type LawyerPublicProfile = {
  id: string;
  fullName: string;
  professionalTitle?: string | null;
  syndicateCardNumber: string;
  whatsappNumber: string;
  verificationStatus: string | number;
  activeCities: City[];
};

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
  replyCount?: number;
};

export type HelpPostReply = {
  id: string;
  lawyerId: string;
  lawyerName?: string;
  lawyerWhatsapp?: string;
  lawyerTitle?: string | null;
  message: string;
  createdAtUtc: string;
};

export type HelpPostDetails = HelpPost & {
  lawyerWhatsapp?: string;
  replies: HelpPostReply[];
};
