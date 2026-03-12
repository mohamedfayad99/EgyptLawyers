export type City = { id: number; name: string };
export type Court = { id: number; name: string; cityId: number };

export type Attachment = {
  id: string;
  fileUrl: string;
  fileType: string;
};

export type LawyerProfile = {
  id: string;
  fullName: string;
  professionalTitle?: string | null;
  syndicateCardNumber: string;
  nationalIdNumber?: string | null;
  whatsappNumber: string;
  verificationStatus: string | number;
  isSuspended: boolean;
  activeCities?: City[];
  profileImageUrl?: string;
  idCardImageUrl?: string;
};

export type LawyerPublicProfile = {
  id: string;
  fullName: string;
  professionalTitle?: string | null;
  syndicateCardNumber: string;
  nationalIdNumber?: string | null;
  whatsappNumber: string;
  verificationStatus: string | number;
  activeCities: City[];
  profileImageUrl?: string;
  idCardImageUrl?: string;
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
  lawyerName: string;
  lawyerProfileImageUrl?: string;
  replyCount: number;
  attachments?: Attachment[];
};

export type HelpPostReply = {
  id: string;
  lawyerId: string;
  lawyerName: string;
  lawyerTitle?: string;
  lawyerWhatsapp?: string;
  lawyerProfileImageUrl?: string;
  message: string;
  createdAtUtc: string;
  rating?: number;
  attachments?: Attachment[];
};

export type HelpPostDetails = HelpPost & {
  lawyerName: string;
  lawyerWhatsapp?: string;
  lawyerProfileImageUrl?: string;
  replies: HelpPostReply[];
};

export type AppNotification = {
  id: string;
  postId: string;
  postDescription: string;
  replierName: string;
  message: string;
  isRead: boolean;
  createdAtUtc: string;
};
