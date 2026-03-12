import { createContext, useContext, useState, useCallback } from 'react';

export type Lang = 'en' | 'ar';

const translations = {
  en: {
    // Sidebar / nav
    dashboard: 'Dashboard',
    lawyers: 'Lawyers',
    pendingApprovals: 'Approvals',
    cities: 'Cities',
    courts: 'Courts',
    posts: 'Posts',
    adminPanel: 'Admin Panel',
    logout: 'Logout',
    lawyer: 'Lawyer',

    // Dashboard
    totalLawyers: 'Total Lawyers',
    pendingApprovalsCard: 'Approvals',
    citiesCard: 'Cities',
    courtsCard: 'Courts',
    recentRegistrations: 'Recent Registrations',
    latestActivity: 'Latest lawyer registration activity',

    // Table headers
    name: 'Name',
    whatsapp: 'WhatsApp',
    syndicateNo: 'Syndicate #',
    status: 'Status',
    date: 'Date',
    registered: 'Registered',
    actions: 'Actions',
    description: 'Description',
    city: 'City',
    court: 'Court',
    lawyerId: 'Lawyer ID',
    created: 'Created',

    // Statuses
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    blocked: 'Blocked',
    open: 'Open',
    closed: 'Closed',

    // Actions
    approve: 'Approve',
    reject: 'Reject',
    block: 'Block',
    unblock: 'Unblock',

    // Filters
    filterByStatus: 'Status',
    allStatuses: 'All',
    allCities: 'All Cities',
    allCourts: 'All Courts',

    // Search
    searchLawyers: 'Search by name, syndicate #, or phone…',
    searchPosts: 'Search help posts…',

    // Action messages
    lawyerApproved: 'Lawyer approved successfully.',
    lawyerRejected: 'Lawyer rejected.',
    lawyerBlocked: 'Lawyer blocked.',
    failedToApprove: 'Failed to approve lawyer',
    failedToReject: 'Failed to reject lawyer',
    failedToBlock: 'Failed to block lawyer',
    failedToUnblock: 'Failed to unblock lawyer',
    failedToLoadLawyers: 'Failed to load lawyers',
    failedToLoadDashboard: 'Failed to load dashboard data',
    failedToLoadPosts: 'Failed to load help posts',
    failedToLoadComments: 'Failed to load comments',

    // Empty messages
    noLawyers: 'No lawyers found. Data will appear when the backend is running.',
    noPending: 'No pending lawyers found.',
    noPosts: 'No help posts found.',
    noComments: 'No comments yet',
    noNewRegistrations: 'No new registration requests',

    // Dialog
    approveLawyer: 'Approve Lawyer',
    rejectLawyer: 'Reject Lawyer',
    blockLawyer: 'Block Lawyer',
    approveMsg: 'Are you sure you want to approve',
    rejectMsg: 'Are you sure you want to reject',
    blockMsg: 'Are you sure you want to block',

    // Post modal
    postDetails: 'Post Details',
    commentsTitle: 'Comments',
    replies: 'Replies',
    close: 'Close',
    deletePost: 'Delete Post',
    confirmDeletePost: 'Are you sure you want to delete this post?',
    postDeleted: 'Post deleted successfully.',
    failedToDeletePost: 'Failed to delete post.',

    // TopBar subtitles
    lawyersSubtitle: 'Approved lawyers only',
    pendingSubtitle: 'Manage lawyer registrations',
    postsSubtitle: 'Help posts submitted by lawyers',

    // Lawyer Profile Drawer
    lawyerProfile: 'Lawyer Profile',
    viewDetails: 'View Details',
    contactInfo: 'Contact Information',
    professionalIdInfo: 'Professional & Identification',
    nationalIdNumber: 'National ID Number',
    idCardImage: 'ID Card Image',
    noImageProvided: 'No image provided.',
    updated: 'Updated',
    suspended: 'Suspended',
    active: 'Active',
    failedToLoadProfile: 'Unable to load lawyer profile.',
    retry: 'Retry',
    uploadedDocuments: 'Uploaded Documents',
    profileImage: 'Profile Image',
    personalInfo: 'Personal Information',
    download: 'Download',
    attachments: 'Attachments',
    failedToUpdateStatus: 'Failed to update lawyer status.',
  },
  ar: {
    // Sidebar / nav
    dashboard: 'لوحة التحكم',
    lawyers: 'المحامون',
    pendingApprovals: 'طلبات الموافقة',
    cities: 'المدن',
    courts: 'المحاكم',
    posts: 'المنشورات',
    adminPanel: 'لوحة الإدارة',
    logout: 'تسجيل الخروج',
    lawyer: 'محام',

    // Dashboard
    totalLawyers: 'إجمالي المحامين',
    pendingApprovalsCard: 'طلبات الموافقة',
    citiesCard: 'المدن',
    courtsCard: 'المحاكم',
    recentRegistrations: 'آخر التسجيلات',
    latestActivity: 'أحدث نشاط تسجيل للمحامين',

    // Table headers
    name: 'الاسم',
    whatsapp: 'واتساب',
    syndicateNo: 'رقم النقابة',
    status: 'الحالة',
    date: 'التاريخ',
    registered: 'تاريخ التسجيل',
    actions: 'الإجراءات',
    description: 'الوصف',
    city: 'المدينة',
    court: 'المحكمة',
    lawyerId: 'رقم المحامي',
    created: 'تاريخ الإنشاء',

    // Statuses
    pending: 'قيد الانتظار',
    approved: 'مقبول',
    rejected: 'مرفوض',
    blocked: 'محظور',
    open: 'مفتوح',
    closed: 'مغلق',

    // Actions
    approve: 'قبول',
    reject: 'رفض',
    block: 'حظر',
    unblock: 'إلغاء الحظر',

    // Filters
    filterByStatus: 'الحالة',
    allStatuses: 'الكل',
    allCities: 'كل المدن',
    allCourts: 'كل المحاكم',

    // Search
    searchLawyers: 'بحث بالاسم أو رقم النقابة أو الهاتف…',
    searchPosts: 'بحث في المنشورات…',

    // Action messages
    lawyerApproved: 'تم قبول المحامي بنجاح.',
    lawyerRejected: 'تم رفض المحامي.',
    lawyerBlocked: 'تم حظر المحامي.',
    failedToApprove: 'فشل في قبول المحامي',
    failedToReject: 'فشل في رفض المحامي',
    failedToBlock: 'فشل في حظر المحامي',
    failedToUnblock: 'فشل في إلغاء حظر المحامي',
    failedToLoadLawyers: 'فشل في تحميل بيانات المحامين',
    failedToLoadDashboard: 'فشل في تحميل بيانات لوحة التحكم',
    failedToLoadPosts: 'فشل في تحميل المنشورات',
    failedToLoadComments: 'فشل في تحميل التعليقات',

    // Empty messages
    noLawyers: 'لا يوجد محامون. ستظهر البيانات عند تشغيل الخادم.',
    noPending: 'لا يوجد طلبات معلقة.',
    noPosts: 'لا توجد منشورات.',
    noComments: 'لا توجد تعليقات بعد',
    noNewRegistrations: 'لا توجد طلبات تسجيل جديدة',

    // Dialog
    approveLawyer: 'قبول المحامي',
    rejectLawyer: 'رفض المحامي',
    blockLawyer: 'حظر المحامي',
    approveMsg: 'هل أنت متأكد من قبول',
    rejectMsg: 'هل أنت متأكد من رفض',
    blockMsg: 'هل أنت متأكد من حظر',

    // Post modal
    postDetails: 'تفاصيل المنشور',
    commentsTitle: 'التعليقات',
    replies: 'الردود',
    close: 'إغلاق',
    deletePost: 'حذف المنشور',
    confirmDeletePost: 'هل أنت متأكد من حذف هذا المنشور؟',
    postDeleted: 'تم حذف المنشور بنجاح.',
    failedToDeletePost: 'فشل في حذف المنشور.',

    // TopBar subtitles
    lawyersSubtitle: 'المحامون المعتمدون فقط',
    pendingSubtitle: 'إدارة طلبات الموافقة',
    postsSubtitle: 'المنشورات المقدمة من المحامين',

    // Lawyer Profile Drawer
    lawyerProfile: 'ملف المحامي',
    viewDetails: 'عرض التفاصيل',
    contactInfo: 'معلومات التواصل',
    professionalIdInfo: 'المعلومات المهنية والتعريفية',
    nationalIdNumber: 'رقم الهوية الوطنية',
    idCardImage: 'صورة بطاقة الهوية',
    noImageProvided: 'لم يتم تحميل صورة.',
    updated: 'آخر تحديث',
    suspended: 'موقوف',
    active: 'نشط',
    failedToLoadProfile: 'فشل تحميل ملف المحامي.',
    retry: 'إعادة المحاولة',
    uploadedDocuments: 'المستندات المرفوعة',
    profileImage: 'صورة الشخصية',
    personalInfo: 'المعلومات الشخصية',
    download: 'تنزيل',
    attachments: 'المرفقات',
    failedToUpdateStatus: 'فشل في تحديث حالة المحامي.',
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

interface LanguageContextType {
  lang: Lang;
  toggleLang: () => void;
  // Support both overloaded signatures:
  t: {
    (key: TranslationKey): string;
    (en: string, ar: string): string;
  };
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Lang>('en');

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === 'en' ? 'ar' : 'en'));
  }, []);

  function t(enOrKey: string, ar?: string): string {
    if (ar !== undefined) {
      // Old usage: t(en: string, ar: string)
      return lang === 'en' ? enOrKey : ar;
    }
    // New usage: t(key: TranslationKey)
    return translations[lang][enOrKey as TranslationKey] || enOrKey;
  }

  const isRTL = lang === 'ar';

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t: t as any, isRTL }}>
      <div dir={isRTL ? 'rtl' : 'ltr'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLang = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLang must be used within LanguageProvider');
  return context;
};
