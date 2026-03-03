import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { useLang } from '../../contexts/LanguageContext';

const steps = [
    {
        icon: DescriptionIcon,
        en: { title: 'Post Your Request', desc: 'Select the court and city, describe your legal need, and attach relevant documents.' },
        ar: { title: 'انشر طلبك', desc: 'اختر المحكمة والمدينة، صف حاجتك القانونية، وأرفق المستندات ذات الصلة.' },
    },
    {
        icon: NotificationsActiveIcon,
        en: { title: 'Lawyers Get Notified', desc: 'Lawyers working in the same city receive instant push notifications about your request.' },
        ar: { title: 'يتم إخطار المحامين', desc: 'يتلقى المحامون العاملون في نفس المدينة إشعارات فورية بطلبك.' },
    },
    {
        icon: WhatsAppIcon,
        en: { title: 'Connect via WhatsApp', desc: 'Review responder profiles and contact the right lawyer directly through WhatsApp.' },
        ar: { title: 'تواصل عبر واتساب', desc: 'راجع ملفات المحامين المستجيبين وتواصل مع المناسب مباشرة عبر واتساب.' },
    },
];

export default function HowItWorks() {
    const { t } = useLang();

    return (
        <Box id="how-it-works" sx={{ py: { xs: 10, md: 14 }, bgcolor: '#F8FAFC' }}>
            <Container maxWidth="lg">
                {/* Header */}
                <Stack alignItems="center" spacing={1.5} sx={{ mb: 8 }}>
                    <Typography
                        sx={{
                            color: '#D4AF37', fontWeight: 600, fontSize: '0.8rem',
                            textTransform: 'uppercase', letterSpacing: 2,
                        }}
                    >
                        {t('How It Works', 'كيف يعمل')}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A', textAlign: 'center' }}>
                        {t('Three Simple Steps', 'ثلاث خطوات بسيطة')}
                    </Typography>
                </Stack>

                {/* Steps */}
                <Grid container spacing={4} justifyContent="center">
                    {steps.map((step, i) => (
                        <Grid key={i} size={{ xs: 12, md: 4 }}>
                            <Stack alignItems="center" spacing={2} sx={{ textAlign: 'center', position: 'relative' }}>
                                {/* Icon box */}
                                <Box
                                    sx={{
                                        width: 96, height: 96, borderRadius: 4,
                                        bgcolor: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        boxShadow: '0 8px 32px rgba(15,23,42,0.12)',
                                        transition: 'box-shadow 0.3s',
                                        '&:hover': { boxShadow: '0 8px 32px rgba(212,175,55,0.15)' },
                                    }}
                                >
                                    <step.icon sx={{ fontSize: 36, color: '#D4AF37' }} />
                                </Box>

                                {/* Number badge */}
                                <Box
                                    sx={{
                                        width: 32, height: 32, borderRadius: '50%', bgcolor: '#D4AF37',
                                        color: '#0F172A', fontWeight: 700, fontSize: '0.85rem',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', mt: -1.5,
                                    }}
                                >
                                    {i + 1}
                                </Box>

                                <Typography variant="h6" sx={{ fontWeight: 700, color: '#0F172A' }}>
                                    {t(step.en.title, step.ar.title)}
                                </Typography>
                                <Typography sx={{ color: '#64748B', lineHeight: 1.7, maxWidth: 320 }}>
                                    {t(step.en.desc, step.ar.desc)}
                                </Typography>
                            </Stack>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}
