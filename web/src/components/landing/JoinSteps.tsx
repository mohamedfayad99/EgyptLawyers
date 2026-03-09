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
        en: { step: 'Step 1', title: 'Download the App', desc: 'Get the Egyptian Lawyers Network app from the App Store or Google Play. It\'s free to download.' },
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
    const { t } = useLang();
    const { ref, visible } = useScrollAnimation();

    return (
        <Box
            id="join-steps"
            sx={{
                py: { xs: 10, md: 14 },
                bgcolor: 'var(--color-background)',
            }}
        >
            <Container maxWidth="lg">
                {/* Header */}
                <Stack alignItems="center" spacing={1.5} sx={{ mb: 8 }}>
                    <Typography
                        sx={{
                            color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.8rem',
                            textTransform: 'uppercase', letterSpacing: 2,
                        }}
                    >
                        {t('How to Join', 'كيفية الانضمام')}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: 'var(--color-text)', textAlign: 'center' }}>
                        {t('Get Started in 4 Simple Steps', 'ابدأ في 4 خطوات بسيطة')}
                    </Typography>
                    <Typography sx={{ color: 'rgba(var(--color-text-rgb),0.65)', textAlign: 'center', maxWidth: 520, lineHeight: 1.7, fontSize: '0.95rem' }}>
                        {t(
                            'From download to your first connection — the entire process takes less than 24 hours.',
                            'من التحميل حتى أول تواصل — تستغرق العملية بأكملها أقل من 24 ساعة.',
                        )}
                    </Typography>
                </Stack>

                {/* Steps */}
                <Grid ref={ref} container spacing={3}>
                    {steps.map((step, i) => (
                        <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }} sx={{ display: 'flex' }}>
                            <Box
                                sx={{
                                    flex: 1,
                                    p: 3.5,
                                    borderRadius: 4,
                                    border: '1px solid rgba(var(--color-text-rgb),0.07)',
                                    bgcolor: 'var(--color-surface)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 2,
                                    position: 'relative',
                                    overflow: 'hidden',
                                    transition: 'all 0.6s cubic-bezier(0.16,1,0.3,1)',
                                    transitionDelay: `${i * 110}ms`,
                                    opacity: visible ? 1 : 0,
                                    transform: visible ? 'translateY(0)' : 'translateY(28px)',
                                    '&:hover': {
                                        transform: 'translateY(-6px)',
                                        boxShadow: `0 20px 48px rgba(0,0,0,0.08)`,
                                        borderColor: step.color,
                                    },
                                }}
                            >
                                {/* Step number watermark */}
                                <Typography
                                    sx={{
                                        position: 'absolute',
                                        top: -8,
                                        right: 16,
                                        fontSize: '5rem',
                                        fontWeight: 900,
                                        color: 'rgba(var(--color-text-rgb),0.04)',
                                        lineHeight: 1,
                                        userSelect: 'none',
                                    }}
                                >
                                    {i + 1}
                                </Typography>

                                {/* Icon */}
                                <Box
                                    sx={{
                                        width: 52, height: 52, borderRadius: 3,
                                        bgcolor: `${step.color}18`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}
                                >
                                    <step.icon sx={{ color: step.color, fontSize: 26 }} />
                                </Box>

                                {/* Step label */}
                                <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: step.color, textTransform: 'uppercase', letterSpacing: 1 }}>
                                    {t(step.en.step, step.ar.step)}
                                </Typography>

                                {/* Title */}
                                <Typography sx={{ fontWeight: 700, color: 'var(--color-text)', fontSize: '1rem' }}>
                                    {t(step.en.title, step.ar.title)}
                                </Typography>

                                {/* Desc */}
                                <Typography sx={{ color: 'rgba(var(--color-text-rgb),0.65)', fontSize: '0.875rem', lineHeight: 1.7 }}>
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
