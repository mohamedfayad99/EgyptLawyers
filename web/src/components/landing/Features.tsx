import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import LockIcon from '@mui/icons-material/Lock';
import { useLang } from '../../contexts/LanguageContext';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const features = [
    {
        icon: VerifiedUserIcon,
        color: '#22C55E',                          // ← green preserved
        en: { title: 'Verified Members Only', desc: 'Every lawyer is verified through their Egyptian Bar Association Syndicate Card before joining. No unverified accounts.' },
        ar: { title: 'أعضاء موثقون فقط', desc: 'يتم التحقق من كل محامٍ من خلال بطاقة نقابة المحامين المصريين قبل الانضمام. لا حسابات غير موثقة.' },
    },
    {
        icon: LocationOnIcon,
        color: 'var(--color-primary)',
        en: { title: 'Court & City Matching', desc: 'Find colleagues based on specific courts and cities across all 27 Egyptian governorates.' },
        ar: { title: 'مطابقة المحكمة والمدينة', desc: 'ابحث عن زملاء بناءً على محاكم ومدن محددة في جميع المحافظات المصرية الـ27.' },
    },
    {
        icon: NotificationsActiveIcon,
        color: 'var(--color-accent)',
        en: { title: 'Instant Notifications', desc: 'Verified lawyers in the matching city are notified in real-time the moment a request is posted.' },
        ar: { title: 'إشعارات فورية', desc: 'يتم إخطار المحامين الموثقين في المدينة المطابقة في الوقت الفعلي لحظة نشر الطلب.' },
    },
    {
        icon: WhatsAppIcon,
        color: '#25D366',                          // ← WhatsApp green preserved
        en: { title: 'WhatsApp Direct Connect', desc: 'Review responder profiles and contact the right lawyer instantly through WhatsApp — no middlemen.' },
        ar: { title: 'تواصل مباشر عبر واتساب', desc: 'راجع ملفات المستجيبين واتصل بالمحامي المناسب فوراً عبر واتساب — بدون وسطاء.' },
    },
    {
        icon: UploadFileIcon,
        color: '#A78BFA',                          // ← purple preserved
        en: { title: 'Secure Document Sharing', desc: 'Share legal documents, court papers, and case files securely within the verified network.' },
        ar: { title: 'مشاركة المستندات بأمان', desc: 'شارك المستندات القانونية وأوراق المحكمة وملفات القضايا بأمان داخل الشبكة الموثقة.' },
    },
    {
        icon: LockIcon,
        color: '#F59E0B',                          // ← amber preserved
        en: { title: 'Privacy Protected', desc: 'Your contact details are never publicly exposed. Only lawyers who respond to your request can see your information.' },
        ar: { title: 'خصوصية محمية', desc: 'بيانات اتصالك لا تكون مرئية للعامة أبداً. فقط المحامون الذين يستجيبون لطلبك يمكنهم رؤية معلوماتك.' },
    },
];

export default function Features() {
    const { t } = useLang();
    const { ref, visible } = useScrollAnimation();

    return (
        // Light section (was dark navy) — now uses --color-surface (#F3F4F6)
        <Box id="features" sx={{ py: { xs: 10, md: 14 }, bgcolor: 'var(--color-surface)' }}>
            <Container maxWidth="lg">
                {/* Header */}
                <Stack alignItems="center" spacing={1.5} sx={{ mb: 8 }}>
                    <Typography
                        sx={{
                            color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.8rem',
                            textTransform: 'uppercase', letterSpacing: 2,
                        }}
                    >
                        {t('Key Features', 'المميزات الرئيسية')}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: 'var(--color-text)', textAlign: 'center' }}>
                        {t('Everything You Need to Collaborate', 'كل ما تحتاجه للتعاون')}
                    </Typography>
                    <Typography sx={{ color: 'var(--color-secondary-text)', textAlign: 'center', maxWidth: 520, lineHeight: 1.7, fontSize: '0.95rem' }}>
                        {t(
                            'Built specifically for Egyptian legal professionals — every feature is designed around how lawyers actually work.',
                            'مبني خصيصاً للمهنيين القانونيين المصريين — كل ميزة مصممة حول الطريقة التي يعمل بها المحامون فعلياً.',
                        )}
                    </Typography>
                </Stack>

                {/* Cards */}
                <Grid ref={ref} container spacing={3}>
                    {features.map((f, i) => (
                        <Grid key={i} size={{ xs: 12, sm: 6, lg: 4 }} sx={{ display: 'flex' }}>
                            <Box
                                sx={{
                                    p: 3.5,
                                    borderRadius: 3,
                                    border: '1px solid var(--color-border)',
                                    bgcolor: 'var(--color-background)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: '100%',
                                    width: '100%',
                                    transition: 'all 0.6s cubic-bezier(0.16,1,0.3,1)',
                                    transitionDelay: `${i * 80}ms`,
                                    opacity: visible ? 1 : 0,
                                    transform: visible ? 'translateY(0)' : 'translateY(28px)',
                                    '&:hover': {
                                        borderColor: `${f.color}60`,
                                        transform: 'translateY(-6px)',
                                        boxShadow: `0 16px 40px rgba(0,0,0,0.08), 0 0 0 1px ${f.color}20`,
                                    },
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 52, height: 52, borderRadius: 2.5,
                                        bgcolor: `${f.color}15`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        mb: 2.5,
                                        border: `1px solid ${f.color}30`,
                                    }}
                                >
                                    <f.icon sx={{ color: f.color, fontSize: 26 }} />
                                </Box>
                                <Typography sx={{ fontWeight: 700, color: 'var(--color-text)', mb: 1, fontSize: '1.05rem' }}>
                                    {t(f.en.title, f.ar.title)}
                                </Typography>
                                <Typography sx={{ color: 'var(--color-secondary-text)', fontSize: '0.875rem', lineHeight: 1.75 }}>
                                    {t(f.en.desc, f.ar.desc)}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}
