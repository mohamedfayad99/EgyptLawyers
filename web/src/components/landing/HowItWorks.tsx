import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
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
            desc: 'Verified lawyers registered in the same city receive instant push notifications about your request.',
        },
        ar: {
            title: 'يتم إخطار الزملاء',
            desc: 'يتلقى المحامون الموثقون المسجلون في نفس المدينة إشعارات فورية بطلبك.',
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
    const { t } = useLang();
    const { ref, visible } = useScrollAnimation();

    return (
        <Box id="how-it-works" sx={{ py: { xs: 12, md: 16 }, bgcolor: 'var(--color-background)', position: 'relative' }}>
            <Container maxWidth="lg">
                <Stack alignItems="center" spacing={2} sx={{ mb: 10 }}>
                    <Box
                        sx={{
                            display: 'inline-flex', px: 2, py: 0.75, borderRadius: '16px',
                            bgcolor: 'rgba(var(--color-accent-rgb),0.1)', border: '1px solid rgba(var(--color-accent-rgb),0.2)',
                        }}
                    >
                        <Typography sx={{ color: 'var(--color-text)', fontWeight: 700, fontSize: '0.85rem' }}>
                            {t('How It Works', 'كيف يعمل')}
                        </Typography>
                    </Box>
                    <Typography variant="h2" sx={{ fontWeight: 800, color: 'var(--color-primary-dark)', textAlign: 'center', fontSize: { xs: '2.2rem', md: '3rem' }, letterSpacing: '-0.02em' }}>
                        {t('Three Simple Steps', 'ثلاث خطوات بسيطة')}
                    </Typography>
                    <Typography sx={{ color: 'var(--color-secondary-text)', textAlign: 'center', maxWidth: 600, lineHeight: 1.7, fontSize: '1.1rem' }}>
                        {t(
                            'One lawyer posts the need — qualified verified colleagues in the same city respond within minutes.',
                            'يقوم محامٍ بنشر الطلب — ويستجيب زملاؤه الموثقون في نفس المدينة خلال دقائق.',
                        )}
                    </Typography>
                </Stack>

                <Grid ref={ref} container spacing={4} sx={{ position: 'relative' }}>
                    {/* Background Connector Line (Desktop Only) */}
                    <Box sx={{
                        display: { xs: 'none', md: 'block' },
                        position: 'absolute', top: 56, left: 100, right: 100, height: 2,
                        bgcolor: 'var(--color-border)', zIndex: 0
                    }} />

                    {steps.map((step, i) => (
                        <Grid key={i} size={{ xs: 12, md: 4 }} sx={{ display: 'flex' }}>
                            <Box
                                sx={{
                                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                                    textAlign: 'center', zIndex: 1, flex: 1,
                                    transition: 'all 1s cubic-bezier(0.16,1,0.3,1)',
                                    transitionDelay: `${i * 200}ms`,
                                    opacity: visible ? 1 : 0,
                                    transform: visible ? 'translateY(0)' : 'translateY(32px)',
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 112, height: 112, borderRadius: '32px',
                                        bgcolor: 'var(--color-surface)',
                                        border: '4px solid var(--color-background)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        position: 'relative', mb: 4,
                                        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.08)',
                                    }}
                                >
                                    <step.icon sx={{ fontSize: 44, color: 'var(--color-primary)' }} />
                                    
                                    {/* Number Badge */}
                                    <Box
                                        sx={{
                                            position: 'absolute', top: -10, right: -10,
                                            width: 36, height: 36, borderRadius: '50%',
                                            bgcolor: 'var(--color-accent)', color: '#fff',
                                            fontWeight: 800, fontSize: '1.1rem',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            boxShadow: '0 4px 12px rgba(var(--color-accent-rgb), 0.4)',
                                            border: '2px solid var(--color-background)',
                                        }}
                                    >
                                        {i + 1}
                                    </Box>
                                </Box>

                                <Typography variant="h5" sx={{ fontWeight: 800, color: 'var(--color-primary-dark)', mb: 2, fontSize: '1.3rem' }}>
                                    {t(step.en.title, step.ar.title)}
                                </Typography>
                                <Typography sx={{ color: 'var(--color-secondary-text)', lineHeight: 1.7, maxWidth: 320, fontSize: '1.05rem' }}>
                                    {t(step.en.desc, step.ar.desc)}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}
