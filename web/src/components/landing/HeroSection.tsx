import { Box, Button, Container, Grid, Stack, Typography, Chip } from '@mui/material';
import AppleIcon from '@mui/icons-material/Apple';
import GoogleIcon from '@mui/icons-material/Google';
import BalanceIcon from '@mui/icons-material/Balance';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import VerifiedIcon from '@mui/icons-material/Verified';
import { useLang } from '../../contexts/LanguageContext';

// App Store / Play Store links — update once the app is live
const APP_STORE_URL = '#download';
const PLAY_STORE_URL = '#download';

export default function HeroSection() {
    const { t } = useLang();

    const scrollToDownload = () => {
        document.querySelector('#download')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <Box
            id="home"
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                bgcolor: 'var(--color-primary-dark)',
                position: 'relative',
                overflow: 'hidden',
                pt: { xs: 4, md: 0 },
            }}
        >
            {/* Background radial glows */}
            <Box
                sx={{
                    position: 'absolute', inset: 0, opacity: 0.12,
                    background: `
                        radial-gradient(circle at 15% 30%, rgba(var(--color-primary-rgb),0.6) 0%, transparent 45%),
                        radial-gradient(circle at 85% 70%, rgba(var(--color-accent-rgb),0.4) 0%, transparent 45%)
                    `,
                }}
            />
            {/* Subtle grid pattern */}
            <Box
                sx={{
                    position: 'absolute', inset: 0, opacity: 0.03,
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px),
                                      linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)`,
                    backgroundSize: '60px 60px',
                }}
            />

            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: { xs: 8, md: 10 } }}>
                <Grid container spacing={6} alignItems="center">
                    {/* ── Text Column ── */}
                    <Grid size={{ xs: 12, lg: 6 }}>
                        <Stack spacing={3.5}>
                            {/* Badge */}
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                <Box
                                    sx={{
                                        display: 'inline-flex', alignSelf: 'flex-start',
                                        px: 2.5, py: 0.75, borderRadius: 50,
                                        bgcolor: 'rgba(var(--color-primary-rgb),0.12)',
                                        border: '1px solid rgba(var(--color-primary-rgb),0.45)',
                                    }}
                                >
                                    <Typography sx={{ color: 'var(--color-primary)', fontSize: '0.82rem', fontWeight: 700 }}>
                                        {t('For Licensed Lawyers Only', 'للمحامين المرخصين فقط')}
                                    </Typography>
                                </Box>
                                <Chip
                                    icon={<VerifiedIcon sx={{ fontSize: '14px !important', color: '#22C55E !important' }} />}
                                    label={t("Egypt's #1 Legal Network", 'شبكة قانونية رقم 1 في مصر')}
                                    size="medium"
                                    sx={{
                                        bgcolor: 'rgba(34,197,94,0.1)',
                                        border: '1px solid rgba(34,197,94,0.3)',
                                        color: '#22C55E',
                                        fontWeight: 700,
                                        fontSize: '0.82rem',
                                        paddingRight: '15px !important',
                                    }}
                                />
                            </Box>

                            {/* Headline */}
                            <Typography
                                variant="h1"
                                sx={{
                                    fontWeight: 900,
                                    color: 'var(--color-background)',
                                    fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.5rem' },
                                    lineHeight: 1.12,
                                    letterSpacing: '-0.5px',
                                }}
                            >
                                {t(
                                    'Find a Colleague in Any Egyptian Court — Instantly',
                                    'اعثر على زميل في أي محكمة مصرية — فوراً',
                                )}
                            </Typography>

                            {/* Sub-headline */}
                            <Typography
                                sx={{
                                    color: 'rgba(255,255,255,0.72)',
                                    fontSize: '1.05rem',
                                    maxWidth: 520,
                                    lineHeight: 1.8,
                                }}
                            >
                                {t(
                                    'Egypt\'s first professional network built exclusively for verified licensed lawyers. Post a request, get notified colleagues respond, connect via WhatsApp — all in minutes.',
                                    'أول شبكة مهنية في مصر مبنية حصرياً للمحامين المرخصين الموثقين. انشر طلباً، يستجيب زملاؤك، تواصل عبر واتساب — كل ذلك في دقائق.',
                                )}
                            </Typography>

                            {/* Trust chips */}
                            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                {[
                                    t('✓ Free to Join', '✓ مجاني للانضمام'),
                                    t('✓ Syndicate Verified', '✓ موثق بالنقابة'),
                                    t('✓ 27 Governorates', '✓ 27 محافظة'),
                                ].map((chip) => (
                                    <Typography
                                        key={chip}
                                        sx={{
                                            fontSize: '0.8rem', fontWeight: 600,
                                            color: 'rgba(255,255,255,0.65)',
                                            bgcolor: 'rgba(255,255,255,0.06)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            px: 1.5, py: 0.5, borderRadius: 50,
                                        }}
                                    >
                                        {chip}
                                    </Typography>
                                ))}
                            </Stack>

                            {/* CTAs */}
                            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                                <Button
                                    variant="contained"
                                    startIcon={<AppleIcon />}
                                    href={APP_STORE_URL}
                                    sx={{
                                        bgcolor: 'var(--color-background)',
                                        color: 'var(--color-primary-dark)',
                                        fontWeight: 700,
                                        px: 3, py: 1.4, fontSize: '0.95rem', borderRadius: 2,
                                        '& .MuiButton-startIcon': { ml: 0.5 },
                                        '&:hover': {
                                            bgcolor: 'rgba(255,255,255,0.9)',
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                                        },
                                        transition: 'all 0.25s',
                                    }}
                                >
                                    {t('App Store', 'آب ستور')}
                                </Button>
                                <Button
                                    variant="contained"
                                    startIcon={<GoogleIcon />}
                                    href={PLAY_STORE_URL}
                                    sx={{
                                        bgcolor: 'var(--color-accent)',
                                        color: 'var(--color-background)',
                                        fontWeight: 700,
                                        px: 3, py: 1.4, fontSize: '0.95rem', borderRadius: 2,
                                        '& .MuiButton-startIcon': { ml: 0.5 },
                                        '&:hover': {
                                            bgcolor: '#e68336',
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 8px 24px rgba(var(--color-accent-rgb),0.4)',
                                        },
                                        transition: 'all 0.25s',
                                    }}
                                >
                                    {t('Google Play', 'جوجل بلاي')}
                                </Button>
                            </Stack>

                            {/* Learn more scroll hint */}
                            <Box
                                component="button"
                                onClick={scrollToDownload}
                                sx={{
                                    display: 'inline-flex', alignItems: 'center', gap: 1,
                                    background: 'none', border: 'none', cursor: 'pointer', p: 0, mt: 1,
                                    color: 'rgba(255,255,255,0.45)',
                                    fontSize: '0.8rem', fontWeight: 500,
                                    '&:hover': { color: 'rgba(255,255,255,0.75)' },
                                    transition: 'color 0.2s',
                                }}
                            >
                                <ArrowDownwardIcon sx={{ fontSize: 16, animation: 'bounce 2s infinite' }} />
                                {t('Scroll to learn more', 'اسحب لأسفل لمعرفة المزيد')}
                            </Box>
                        </Stack>
                    </Grid>

                    {/* ── App Mockup Column ── */}
                    <Grid size={{ xs: 12, lg: 6 }} sx={{ display: 'flex', justifyContent: { xs: 'center', lg: 'flex-end' } }}>
                        <Box sx={{ position: 'relative' }}>
                            {/* Glow halo */}
                            <Box
                                sx={{
                                    position: 'absolute', inset: -60, borderRadius: '50%',
                                    background: 'radial-gradient(circle, rgba(var(--color-primary-rgb),0.22) 0%, transparent 70%)',
                                    filter: 'blur(30px)',
                                    zIndex: 0,
                                }}
                            />

                            {/* Phone shell */}
                            <Box
                                sx={{
                                    position: 'relative', zIndex: 1,
                                    width: 270, height: 520,
                                    borderRadius: '3.5rem',
                                    border: '2px solid rgba(255,255,255,0.12)',
                                    bgcolor: '#111827',
                                    boxShadow: '0 32px 80px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.05)',
                                    overflow: 'hidden',
                                    display: 'flex', flexDirection: 'column',
                                }}
                            >
                                {/* Status bar */}
                                <Box sx={{ height: 44, px: 3, pt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexShrink: 0 }}>
                                    <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.7rem', fontWeight: 600 }}>9:41</Typography>
                                    <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                                        {[3, 4, 5, 4].map((h, i) => (
                                            <Box key={i} sx={{ width: 3, height: h, bgcolor: 'rgba(255,255,255,0.7)', borderRadius: 1 }} />
                                        ))}
                                    </Box>
                                </Box>

                                {/* App header */}
                                <Box sx={{ px: 2.5, pt: 1.5, pb: 2 }}>
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <Box sx={{ width: 28, height: 28, borderRadius: '50%', bgcolor: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <BalanceIcon sx={{ fontSize: 14, color: '#fff' }} />
                                        </Box>
                                        <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '0.8rem' }}>
                                            {t('Lawyers Network', 'شبكة المحامين')}
                                        </Typography>
                                    </Stack>
                                </Box>

                                {/* Search bar */}
                                <Box sx={{ mx: 2.5, mb: 2, bgcolor: 'rgba(255,255,255,0.06)', borderRadius: 2, px: 2, py: 1, border: '1px solid rgba(255,255,255,0.08)' }}>
                                    <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem' }}>
                                        {t('Search by court or city...', 'ابحث بالمحكمة أو المدينة...')}
                                    </Typography>
                                </Box>

                                {/* Request cards */}
                                <Stack spacing={1.5} sx={{ px: 2.5, flex: 1, overflowY: 'hidden' }}>
                                    {[
                                        { court: t('Cairo Court', 'محكمة القاهرة'), city: t('Cairo', 'القاهرة'), tag: t('Urgent', 'عاجل'), color: '#EF4444' },
                                        { court: t('Alexandria Court', 'محكمة الإسكندرية'), city: t('Alexandria', 'الإسكندرية'), tag: t('New', 'جديد'), color: '#22C55E' },
                                        { court: t('Giza Court', 'محكمة الجيزة'), city: t('Giza', 'الجيزة'), tag: t('Open', 'مفتوح'), color: 'var(--color-primary)' },
                                    ].map((card, i) => (
                                        <Box
                                            key={i}
                                            sx={{
                                                bgcolor: 'rgba(255,255,255,0.05)',
                                                borderRadius: 2.5,
                                                p: 2,
                                                border: '1px solid rgba(255,255,255,0.07)',
                                            }}
                                        >
                                            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.75}>
                                                <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.73rem', fontWeight: 600 }}>
                                                    {card.court}
                                                </Typography>
                                                <Box sx={{ bgcolor: `${card.color}20`, border: `1px solid ${card.color}50`, borderRadius: 50, px: 1, py: 0.15 }}>
                                                    <Typography sx={{ color: card.color, fontSize: '0.62rem', fontWeight: 700 }}>
                                                        {card.tag}
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: card.color, flexShrink: 0 }} />
                                                <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.65rem' }}>
                                                    {card.city}
                                                </Typography>
                                            </Stack>
                                            {/* skeleton lines */}
                                            <Stack spacing={0.5} mt={1}>
                                                <Box sx={{ height: 4, borderRadius: 1, bgcolor: 'rgba(255,255,255,0.08)', width: '85%' }} />
                                                <Box sx={{ height: 4, borderRadius: 1, bgcolor: 'rgba(255,255,255,0.05)', width: '60%' }} />
                                            </Stack>
                                        </Box>
                                    ))}
                                </Stack>

                                {/* Bottom nav */}
                                <Box
                                    sx={{
                                        height: 60, mt: 'auto', flexShrink: 0,
                                        borderTop: '1px solid rgba(255,255,255,0.06)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-around', px: 1,
                                    }}
                                >
                                    {['🏠', '🔔', '➕', '👤'].map((icon, i) => (
                                        <Box
                                            key={i}
                                            sx={{
                                                width: 40, height: 40, borderRadius: 2,
                                                bgcolor: i === 2 ? 'var(--color-primary)' : 'transparent',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: i === 2 ? '1.1rem' : '1rem',
                                            }}
                                        >
                                            {icon}
                                        </Box>
                                    ))}
                                </Box>
                            </Box>

                            {/* Floating notification card */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    bottom: 80, right: { xs: -20, lg: -60 },
                                    bgcolor: 'rgba(37,52,63,0.95)',
                                    backdropFilter: 'blur(12px)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: 3, p: 1.5,
                                    boxShadow: '0 16px 40px rgba(0,0,0,0.4)',
                                    minWidth: 190,
                                    animation: 'floatCard 3s ease-in-out infinite',
                                    zIndex: 2,
                                }}
                            >
                                <Stack direction="row" spacing={1} alignItems="flex-start">
                                    <Box sx={{ width: 32, height: 32, borderRadius: 1.5, bgcolor: 'rgba(34,197,94,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <VerifiedIcon sx={{ fontSize: 18, color: '#22C55E' }} />
                                    </Box>
                                    <Box>
                                        <Typography sx={{ color: '#fff', fontSize: '0.72rem', fontWeight: 700, lineHeight: 1.2 }}>
                                            {t('3 Lawyers Responded', '3 محامين استجابوا')}
                                        </Typography>
                                        <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem', mt: 0.25 }}>
                                            {t('Just now · Cairo Court', 'الآن · محكمة القاهرة')}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Container>

            {/* CSS keyframes */}
            <style>{`
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(5px); }
                }
                @keyframes floatCard {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-8px); }
                }
            `}</style>
        </Box>
    );
}
