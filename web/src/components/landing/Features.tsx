import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import LockIcon from '@mui/icons-material/Lock';
import { useLang } from '../../contexts/LanguageContext';

const features = [
    {
        icon: VerifiedUserIcon,
        en: { title: 'Verified Network', desc: 'Every lawyer is verified through their Syndicate Card before joining the network.' },
        ar: { title: 'شبكة موثقة', desc: 'يتم التحقق من كل محامٍ من خلال بطاقة النقابة قبل الانضمام للشبكة.' },
    },
    {
        icon: LocationOnIcon,
        en: { title: 'Court & City Matching', desc: 'Find lawyers based on specific courts and cities across Egypt.' },
        ar: { title: 'مطابقة المحكمة والمدينة', desc: 'ابحث عن محامين بناءً على محاكم ومدن محددة في جميع أنحاء مصر.' },
    },
    {
        icon: NotificationsActiveIcon,
        en: { title: 'Smart Notifications', desc: 'Relevant lawyers get notified instantly when a matching request is posted.' },
        ar: { title: 'إشعارات ذكية', desc: 'يتم إخطار المحامين المعنيين فوراً عند نشر طلب مطابق.' },
    },
    {
        icon: WhatsAppIcon,
        en: { title: 'WhatsApp Direct', desc: 'Connect with lawyers directly through WhatsApp for quick communication.' },
        ar: { title: 'واتساب مباشر', desc: 'تواصل مع المحامين مباشرة عبر واتساب للتواصل السريع.' },
    },
    {
        icon: UploadFileIcon,
        en: { title: 'Document Sharing', desc: 'Share legal documents, court papers, and files securely within the platform.' },
        ar: { title: 'مشاركة المستندات', desc: 'شارك المستندات القانونية وأوراق المحكمة والملفات بأمان داخل المنصة.' },
    },
    {
        icon: LockIcon,
        en: { title: 'Secure & Private', desc: 'Your data and communications are protected with industry-standard security.' },
        ar: { title: 'آمن وخاص', desc: 'بياناتك واتصالاتك محمية بمعايير أمان عالمية.' },
    },
];

export default function Features() {
    const { t } = useLang();

    return (
        <Box id="features" sx={{ py: { xs: 10, md: 14 }, bgcolor: '#0F172A' }}>
            <Container maxWidth="lg">
                {/* Header */}
                <Stack alignItems="center" spacing={1.5} sx={{ mb: 8 }}>
                    <Typography
                        sx={{
                            color: '#D4AF37', fontWeight: 600, fontSize: '0.8rem',
                            textTransform: 'uppercase', letterSpacing: 2,
                        }}
                    >
                        {t('Key Features', 'المميزات الرئيسية')}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#F8FAFC', textAlign: 'center' }}>
                        {t('Everything You Need', 'كل ما تحتاجه')}
                    </Typography>
                </Stack>

                {/* Cards */}
                <Grid container spacing={3}>
                    {features.map((f, i) => (
                        <Grid key={i} size={{ xs: 12, sm: 6, lg: 4 }}>
                            <Box
                                sx={{
                                    p: 3.5, borderRadius: 3,
                                    border: '1px solid rgba(212,175,55,0.1)',
                                    bgcolor: 'rgba(30,41,59,0.5)',
                                    transition: 'all 0.3s',
                                    '&:hover': {
                                        borderColor: 'rgba(212,175,55,0.3)',
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 12px 40px rgba(212,175,55,0.06)',
                                    },
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 48, height: 48, borderRadius: 2,
                                        bgcolor: 'rgba(212,175,55,0.1)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        mb: 2,
                                    }}
                                >
                                    <f.icon sx={{ color: '#D4AF37', fontSize: 24 }} />
                                </Box>
                                <Typography sx={{ fontWeight: 700, color: '#F8FAFC', mb: 1, fontSize: '1.05rem' }}>
                                    {t(f.en.title, f.ar.title)}
                                </Typography>
                                <Typography sx={{ color: 'rgba(212,175,55,0.5)', fontSize: '0.875rem', lineHeight: 1.7 }}>
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
