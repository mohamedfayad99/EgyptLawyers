import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EastIcon from '@mui/icons-material/East';
import WestIcon from '@mui/icons-material/West';
import { useLang } from '../../contexts/LanguageContext';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const steps = [
    {
        icon: DescriptionIcon,
        en: {
            title: 'Post Your Request',
            desc: 'Select the court and city, describe your legal need, and attach relevant documents. Takes less than 2 minutes.',
        },
        ar: {
            title: 'انشر طلبك',
            desc: 'اختر المحكمة والمدينة، صف حاجتك القانونية، وأرفق المستندات. يستغرق أقل من دقيقتين.',
        },
    },
    {
        icon: NotificationsActiveIcon,
        en: {
            title: 'Colleagues Get Notified',
            desc: 'Verified lawyers registered in the same city receive instant push notifications about your request — only lawyers, never clients.',
        },
        ar: {
            title: 'يتم إخطار الزملاء',
            desc: 'يتلقى المحامون الموثقون المسجلون في نفس المدينة إشعارات فورية بطلبك — المحامون فقط، وليس العملاء.',
        },
    },
    {
        icon: WhatsAppIcon,
        en: {
            title: 'Connect via WhatsApp',
            desc: 'Review responder profiles and ratings, then contact the right colleague directly through WhatsApp.',
        },
        ar: {
            title: 'تواصل عبر واتساب',
            desc: 'راجع ملفات المحامين المستجيبين وتقييماتهم، ثم تواصل مع الزميل المناسب مباشرة عبر واتساب.',
        },
    },
];

export default function HowItWorks() {
    const { t, isRTL } = useLang();
    const { ref, visible } = useScrollAnimation();

    const ArrowIcon = isRTL ? WestIcon : EastIcon;

    return (
        <Box id="how-it-works" sx={{ py: { xs: 10, md: 14 }, bgcolor: 'var(--color-background)' }}>
            <Container maxWidth="lg">
                {/* Header */}
                <Stack alignItems="center" spacing={1.5} sx={{ mb: 8 }}>
                    <Typography
                        sx={{
                            color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.8rem',
                            textTransform: 'uppercase', letterSpacing: 2,
                        }}
                    >
                        {t('How It Works', 'كيف يعمل')}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: 'var(--color-text)', textAlign: 'center' }}>
                        {t('Three Simple Steps', 'ثلاث خطوات بسيطة')}
                    </Typography>
                    <Typography sx={{ color: 'rgba(var(--color-text-rgb),0.65)', textAlign: 'center', maxWidth: 520, lineHeight: 1.7, fontSize: '0.95rem' }}>
                        {t(
                            'One lawyer posts the need — qualified verified colleagues in the same city respond within minutes.',
                            'يقوم محامٍ بنشر الطلب — ويستجيب زملاؤه الموثقون في نفس المدينة خلال دقائق.',
                        )}
                    </Typography>
                </Stack>

                {/* Steps + Connectors */}
                <Grid ref={ref} container alignItems="flex-start">
                    {steps.map((step, i) => (
                        <>
                            <Grid key={`step-${i}`} size={{ xs: 12, md: 3.5 }}>
                                <Stack
                                    alignItems="center"
                                    spacing={2}
                                    sx={{
                                        textAlign: 'center',
                                        transition: 'all 0.6s cubic-bezier(0.16,1,0.3,1)',
                                        transitionDelay: `${i * 150}ms`,
                                        opacity: visible ? 1 : 0,
                                        transform: visible ? 'translateY(0)' : 'translateY(32px)',
                                    }}
                                >
                                    {/* Icon box */}
                                    <Box
                                        sx={{
                                            width: 100, height: 100, borderRadius: 4,
                                            bgcolor: 'var(--color-primary-dark)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            boxShadow: '0 8px 32px rgba(15,23,42,0.14)',
                                            transition: 'box-shadow 0.3s, transform 0.3s',
                                            '&:hover': {
                                                boxShadow: '0 12px 40px rgba(var(--color-primary-rgb),0.3)',
                                                transform: 'translateY(-4px)',
                                            },
                                        }}
                                    >
                                        <step.icon sx={{ fontSize: 40, color: 'var(--color-accent)' }} />
                                    </Box>

                                    {/* Number badge */}
                                    <Box
                                        sx={{
                                            width: 34, height: 34, borderRadius: '50%',
                                            bgcolor: 'var(--color-primary)',
                                            color: '#fff', fontWeight: 800, fontSize: '0.9rem',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            mt: -1.5,
                                            boxShadow: '0 4px 12px rgba(var(--color-primary-rgb),0.4)',
                                        }}
                                    >
                                        {i + 1}
                                    </Box>

                                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--color-text)' }}>
                                        {t(step.en.title, step.ar.title)}
                                    </Typography>
                                    <Typography sx={{ color: 'rgba(var(--color-text-rgb),0.65)', lineHeight: 1.75, maxWidth: 260, fontSize: '0.9rem' }}>
                                        {t(step.en.desc, step.ar.desc)}
                                    </Typography>
                                </Stack>
                            </Grid>

                            {/* Connector arrow — only between steps, not after the last */}
                            {i < steps.length - 1 && (
                                <Grid
                                    key={`arrow-${i}`}
                                    size={{ xs: 12, md: 0.5 }}
                                    sx={{
                                        display: { xs: 'none', md: 'flex' },
                                        alignItems: 'flex-start',
                                        justifyContent: 'center',
                                        pt: 4.5,
                                        transition: 'all 0.6s ease',
                                        transitionDelay: `${(i + 0.5) * 150}ms`,
                                        opacity: visible ? 1 : 0,
                                    }}
                                >
                                    <ArrowIcon
                                        sx={{
                                            fontSize: 28,
                                            color: 'rgba(var(--color-primary-rgb),0.35)',
                                        }}
                                    />
                                </Grid>
                            )}
                        </>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}
