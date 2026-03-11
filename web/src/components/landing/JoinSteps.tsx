import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import VerifiedIcon from '@mui/icons-material/Verified';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';
import { useLang } from '../../contexts/LanguageContext';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const steps = [
    {
        icon: DownloadIcon,
        color: 'var(--color-primary)',
        en: { step: 'Step 1', title: 'Download the App', desc: 'Get the Egypt Lawyers Network app from the App Store or Google Play. It\'s free to download.' },
        ar: { step: 'الخطوة 1', title: 'حمّل التطبيق', desc: 'احصل على تطبيق شبكة المحامين المصريين من آب ستور أو جوجل بلاي. التحميل مجاني.' },
    },
    {
        icon: PersonAddIcon,
        color: 'var(--color-accent)',
        en: { step: 'Step 2', title: 'Create Your Profile', desc: 'Fill in your professional details — specialization, years of experience, and the courts you cover.' },
        ar: { step: 'الخطوة 2', title: 'أنشئ ملفك المهني', desc: 'أدخل بياناتك المهنية — التخصص وسنوات الخبرة والمحاكم التي تعمل بها.' },
    },
    {
        icon: VerifiedIcon,
        color: '#22C55E',
        en: { step: 'Step 3', title: 'Verify with Syndicate Card', desc: 'Submit your Egyptian Bar Association Syndicate Card for verification. Approval takes under 24 hours.' },
        ar: { step: 'الخطوة 3', title: 'تحقق ببطاقة النقابة', desc: 'قدّم بطاقة نقابة المحامين المصريين للتحقق. تستغرق الموافقة أقل من 24 ساعة.' },
    },
    {
        icon: ConnectWithoutContactIcon,
        color: '#A78BFA',
        en: { step: 'Step 4', title: 'Start Connecting', desc: 'Post requests, respond to colleagues, and grow your professional network across all of Egypt.' },
        ar: { step: 'الخطوة 4', title: 'ابدأ التواصل', desc: 'انشر الطلبات، استجب لزملائك، ووسّع شبكتك المهنية في جميع أنحاء مصر.' },
    },
];

export default function JoinSteps() {
    const { t, isRTL } = useLang();
    const { ref, visible } = useScrollAnimation();

    return (
        <Box
            id="join-steps"
            sx={{
                py: { xs: 12, md: 16 },
                bgcolor: 'var(--color-background)',
            }}
        >
            <Container maxWidth="lg">
                <Stack alignItems="center" spacing={2} sx={{ mb: 10 }}>
                    <Box
                        sx={{
                            display: 'inline-flex', px: 2, py: 0.75, borderRadius: '16px',
                            bgcolor: 'rgba(var(--color-primary-rgb),0.06)', border: '1px solid rgba(var(--color-primary-rgb),0.1)',
                        }}
                    >
                        <Typography sx={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '0.85rem' }}>
                            {t('How to Join', 'كيفية الانضمام')}
                        </Typography>
                    </Box>
                    <Typography variant="h2" sx={{ fontWeight: 800, color: 'var(--color-primary-dark)', textAlign: 'center', fontSize: { xs: '2.2rem', md: '3rem' }, letterSpacing: '-0.02em' }}>
                        {t('Get Started in 4 Simple Steps', 'ابدأ في 4 خطوات بسيطة')}
                    </Typography>
                    <Typography sx={{ color: 'var(--color-secondary-text)', textAlign: 'center', maxWidth: 600, lineHeight: 1.7, fontSize: '1.1rem' }}>
                        {t(
                            'From download to your first connection — the entire process takes less than 24 hours.',
                            'من التحميل حتى أول تواصل — تستغرق العملية بأكملها أقل من 24 ساعة.',
                        )}
                    </Typography>
                </Stack>

                <Grid ref={ref} container spacing={4}>
                    {steps.map((step, i) => (
                        <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }} sx={{ display: 'flex' }}>
                            <Box
                                sx={{
                                    flex: 1,
                                    p: 4,
                                    borderRadius: '24px',
                                    border: '1px solid var(--color-border)',
                                    bgcolor: 'var(--color-surface)',
                                    display: 'flex', flexDirection: 'column', gap: 2.5, position: 'relative', overflow: 'hidden',
                                    transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
                                    transitionDelay: `${i * 120}ms`,
                                    opacity: visible ? 1 : 0,
                                    transform: visible ? 'translateY(0)' : 'translateY(32px)',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.08)',
                                        borderColor: 'transparent',
                                        bgcolor: 'var(--color-background)',
                                    },
                                }}
                            >
                                <Typography
                                    style={{
                                        [isRTL ? 'left' : 'right']: 16,
                                    }}
                                    sx={{
                                        position: 'absolute', top: -16,
                                        fontSize: '7rem', fontWeight: 900,
                                        color: 'var(--color-primary-dark)', opacity: 0.04, lineHeight: 1, userSelect: 'none',
                                    }}
                                >
                                    {i + 1}
                                </Typography>
                                <Box
                                    sx={{
                                        width: 56, height: 56, borderRadius: '16px',
                                        bgcolor: `${step.color}15`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        position: 'relative', zIndex: 1,
                                    }}
                                >
                                    <step.icon sx={{ color: step.color, fontSize: 28 }} />
                                </Box>
                                <Box sx={{ position: 'relative', zIndex: 1 }}>
                                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 800, color: step.color, textTransform: 'uppercase', letterSpacing: 1.5, mb: 1 }}>
                                        {t(step.en.step, step.ar.step)}
                                    </Typography>
                                    <Typography sx={{ fontWeight: 800, color: 'var(--color-primary-dark)', fontSize: '1.2rem', mb: 1.5, letterSpacing: '-0.01em' }}>
                                        {t(step.en.title, step.ar.title)}
                                    </Typography>
                                    <Typography sx={{ color: 'var(--color-secondary-text)', fontSize: '0.95rem', lineHeight: 1.7 }}>
                                        {t(step.en.desc, step.ar.desc)}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}
