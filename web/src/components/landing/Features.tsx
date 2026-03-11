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
        color: 'var(--color-accent)', // Use modern accent green
        en: { title: 'Verified Members Only', desc: 'Every lawyer is verified through their Egyptian Bar Association Syndicate Card before joining. No unverified accounts.' },
        ar: { title: 'أعضاء موثقون فقط', desc: 'يتم التحقق من كل محامٍ من خلال بطاقة نقابة المحامين المصريين قبل الانضمام. لا حسابات غير موثقة.' },
    },
    {
        icon: LocationOnIcon,
        color: 'var(--color-primary)', // Primary dark blue
        en: { title: 'Court & City Matching', desc: 'Find colleagues based on specific courts and cities across all 27 Egyptian governorates.' },
        ar: { title: 'مطابقة المحكمة والمدينة', desc: 'ابحث عن زملاء بناءً على محاكم ومدن محددة في جميع المحافظات المصرية الـ27.' },
    },
    {
        icon: NotificationsActiveIcon,
        color: 'var(--color-secondary-text)', // Gray for variety
        en: { title: 'Instant Notifications', desc: 'Verified lawyers in the matching city are notified in real-time the moment a request is posted.' },
        ar: { title: 'إشعارات فورية', desc: 'يتم إخطار المحامين الموثقين في المدينة المطابقة في الوقت الفعلي لحظة نشر الطلب.' },
    },
    {
        icon: WhatsAppIcon,
        color: '#25D366', // WhatsApp green preserved
        en: { title: 'WhatsApp Direct Connect', desc: 'Review responder profiles and contact the right lawyer instantly through WhatsApp.' },
        ar: { title: 'تواصل مباشر عبر واتساب', desc: 'راجع ملفات المستجيبين واتصل بالمحامي المناسب فوراً عبر واتساب.' },
    },
    {
        icon: UploadFileIcon,
        color: '#A78BFA', // Purple
        en: { title: 'Secure Document Sharing', desc: 'Share legal documents, court papers, and case files securely within the verified network.' },
        ar: { title: 'مشاركة المستندات بأمان', desc: 'شارك المستندات القانونية وأوراق المحكمة وملفات القضايا بأمان داخل الشبكة الموثقة.' },
    },
    {
        icon: LockIcon,
        color: '#F59E0B', // Amber
        en: { title: 'Privacy Protected', desc: 'Your contact details are never publicly exposed until you choose to connect.' },
        ar: { title: 'خصوصية محمية', desc: 'بيانات اتصالك لا تكون مرئية للعامة أبداً. فقط المحامون الذين يستجيبون لطلبك يمكنهم رؤيتها.' },
    },
];

export default function Features() {
    const { t } = useLang();
    const { ref, visible } = useScrollAnimation();

    return (
        <Box id="features" sx={{ py: { xs: 10, md: 14 }, bgcolor: 'var(--color-surface)' }}>
            <Container maxWidth="lg">
                {/* Header */}
                <Stack alignItems="center" spacing={2} sx={{ mb: 8 }}>
                    <Box
                        sx={{
                            display: 'inline-flex',
                            px: 2, py: 0.75,
                            borderRadius: '16px',
                            bgcolor: 'rgba(var(--color-primary-rgb),0.06)',
                            border: '1px solid rgba(var(--color-primary-rgb),0.1)',
                        }}
                    >
                        <Typography sx={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '0.85rem' }}>
                            {t('Key Features', 'المميزات الرئيسية')}
                        </Typography>
                    </Box>

                    <Typography variant="h2" sx={{ fontWeight: 800, color: 'var(--color-primary-dark)', textAlign: 'center', fontSize: { xs: '2rem', md: '2.8rem' }, letterSpacing: '-0.02em' }}>
                        {t('Everything You Need to Collaborate', 'كل ما تحتاجه للتعاون')}
                    </Typography>
                    <Typography sx={{ color: 'var(--color-secondary-text)', textAlign: 'center', maxWidth: 640, lineHeight: 1.7, fontSize: '1.1rem' }}>
                        {t(
                            'Built specifically for Egyptian legal professionals — every feature is designed around how lawyers actually work.',
                            'مبني خصيصاً للمهنيين القانونيين المصريين — كل ميزة مصممة حول الطريقة التي يعمل بها المحامون فعلياً.',
                        )}
                    </Typography>
                </Stack>

                {/* Cards */}
                <Grid ref={ref} container spacing={4}>
                    {features.map((f, i) => (
                        <Grid key={i} size={{ xs: 12, sm: 6, lg: 4 }} sx={{ display: 'flex' }}>
                            <Box
                                sx={{
                                    p: 4,
                                    borderRadius: '24px',
                                    bgcolor: 'var(--color-background)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: '100%',
                                    width: '100%',
                                    transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)',
                                    transitionDelay: `${i * 120}ms`,
                                    opacity: visible ? 1 : 0,
                                    transform: visible ? 'translateY(0)' : 'translateY(28px)',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                                    border: '1px solid var(--color-border)',
                                    '&:hover': {
                                        borderColor: 'transparent',
                                        transform: 'translateY(-8px)',
                                        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)',
                                    },
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 56, height: 56, borderRadius: '16px',
                                        bgcolor: `${f.color}15`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        mb: 3,
                                    }}
                                >
                                    <f.icon sx={{ color: f.color, fontSize: 28 }} />
                                </Box>
                                <Typography sx={{ fontWeight: 800, color: 'var(--color-primary-dark)', mb: 1.5, fontSize: '1.2rem', letterSpacing: '-0.01em' }}>
                                    {t(f.en.title, f.ar.title)}
                                </Typography>
                                <Typography sx={{ color: 'var(--color-secondary-text)', fontSize: '0.95rem', lineHeight: 1.7 }}>
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
