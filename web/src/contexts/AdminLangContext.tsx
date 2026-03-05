import { createContext, useContext, useState, type ReactNode } from 'react';

type Lang = 'en' | 'ar';

interface AdminLangContextType {
  lang: Lang;
  toggleLang: () => void;
  t: (key: string) => string;
  isRtl: boolean;
}

// ─── Translation dictionary ──────────────────────────────────────────────────
const translations: Record<string, Record<Lang, string>> = {
  // Navigation
  Dashboard:           { en: 'Dashboard',           ar: 'لوحة التحكم' },
  Lawyers:             { en: 'Lawyers',              ar: 'المحامون' },
  Cities:              { en: 'Cities',               ar: 'المدن' },
  Courts:              { en: 'Courts',               ar: 'المحاكم' },
  Moderation:          { en: 'Moderation',           ar: 'الإشراف' },
  Logout:              { en: 'Logout',               ar: 'تسجيل الخروج' },
  'Admin Panel':       { en: 'Admin Panel',          ar: 'لوحة الإدارة' },

  // Page titles
  'Content Moderation':{ en: 'Content Moderation',  ar: 'إدارة المحتوى' },
  'User Management':   { en: 'User Management',      ar: 'إدارة المستخدمين' },

  // Table columns
  Lawyer:              { en: 'Lawyer',               ar: 'المحامي' },
  WhatsApp:            { en: 'WhatsApp',             ar: 'واتساب' },
  Status:              { en: 'Status',               ar: 'الحالة' },
  Registered:          { en: 'Registered',           ar: 'تاريخ التسجيل' },
  Actions:             { en: 'Actions',              ar: 'الإجراءات' },

  // Status labels
  Pending:             { en: 'Pending',              ar: 'قيد الانتظار' },
  Approved:            { en: 'Approved',             ar: 'موافق عليه' },
  Rejected:            { en: 'Rejected',             ar: 'مرفوض' },
  Suspended:           { en: 'Suspended',            ar: 'موقوف' },

  // Actions
  Approve:             { en: 'Approve',              ar: 'قبول' },
  Reject:              { en: 'Reject',               ar: 'رفض' },
  'All':               { en: 'All',                  ar: 'الكل' },
  'Search by name or phone…': { en: 'Search by name or phone…', ar: 'بحث باسم أو رقم الهاتف…' },

  // Cities
  'Add New City':      { en: 'Add New City',         ar: 'إضافة مدينة جديدة' },
  'City name':         { en: 'City name',            ar: 'اسم المدينة' },
  'Add City':          { en: 'Add City',             ar: 'إضافة مدينة' },
  'Registered Cities': { en: 'Registered Cities',    ar: 'المدن المسجلة' },
  'ID':                { en: 'ID',                   ar: 'الرقم' },
  'City Name':         { en: 'City Name',            ar: 'اسم المدينة' },

  // Courts
  'Add New Court':     { en: 'Add New Court',        ar: 'إضافة محكمة جديدة' },
  'Court name':        { en: 'Court name',           ar: 'اسم المحكمة' },
  'Select city':       { en: 'Select city',          ar: 'اختر المدينة' },
  'Add Court':         { en: 'Add Court',            ar: 'إضافة محكمة' },
  'Registered Courts': { en: 'Registered Courts',    ar: 'المحاكم المسجلة' },
  'Court Name':        { en: 'Court Name',           ar: 'اسم المحكمة' },
  'City':              { en: 'City',                 ar: 'المدينة' },
};

const AdminLangContext = createContext<AdminLangContextType | undefined>(undefined);

export function AdminLangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');

  const toggleLang = () => setLang((l) => (l === 'en' ? 'ar' : 'en'));

  const t = (key: string): string => {
    return translations[key]?.[lang] ?? key;
  };

  return (
    <AdminLangContext.Provider value={{ lang, toggleLang, t, isRtl: lang === 'ar' }}>
      {children}
    </AdminLangContext.Provider>
  );
}

export function useAdminLang() {
  const ctx = useContext(AdminLangContext);
  if (!ctx) throw new Error('useAdminLang must be used inside AdminLangProvider');
  return ctx;
}
