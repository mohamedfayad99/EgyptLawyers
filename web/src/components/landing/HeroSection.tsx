import { Box, Button, Container, Grid, Stack, Typography, Chip } from '@mui/material';
import AppleIcon from '@mui/icons-material/Apple';
import GoogleIcon from '@mui/icons-material/Google';
import BalanceIcon from '@mui/icons-material/Balance';
import VerifiedIcon from '@mui/icons-material/Verified';
import { useLang } from '../../contexts/LanguageContext';

// App Store / Play Store links — update once the app is live
const APP_STORE_URL = '#download';
const PLAY_STORE_URL = '#download';

export default function HeroSection() {
    const { t, isRTL } = useLang();

    return (
        <Box
            id="home"
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                bgcolor: 'var(--color-background)',
                position: 'relative',
                overflow: 'hidden',
                pt: { xs: 12, md: 8 },
                pb: { xs: 8, md: 0 },
            }}
        >
            {/* Subtle background gradient / blob */}
            <Box
                sx={{
                    position: 'absolute', top: '-10%', right: '-5%', width: '50vw', height: '50vw',
                    background: 'radial-gradient(circle, rgba(var(--color-primary-rgb), 0.04) 0%, transparent 70%)',
                    zIndex: 0, pointerEvents: 'none'
                }}
            />
            <Box
                sx={{
                    position: 'absolute', bottom: '-20%', left: '-10%', width: '60vw', height: '60vw',
                    background: 'radial-gradient(circle, rgba(var(--color-accent-rgb), 0.03) 0%, transparent 70%)',
                    zIndex: 0, pointerEvents: 'none'
                }}
            />

            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                <Grid container spacing={6} alignItems="center">
                    {/* ── Text Column ── */}
                    <Grid size={{ xs: 12, lg: 6 }}>
                        <Stack spacing={4}>
                            {/* Badge */}
                            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                                <Chip
                                    label={t('For Licensed Lawyers Only', 'للمحامين المرخصين فقط')}
                                    size="small"
                                    sx={{
                                        bgcolor: 'rgba(var(--color-primary-rgb),0.08)',
                                        color: 'var(--color-primary)',
                                        fontWeight: 700,
                                        fontSize: '0.75rem',
                                        height: '28px',
                                        border: '1px solid rgba(var(--color-primary-rgb),0.2)',
                                    }}
                                />
                                <Chip
                                    icon={<VerifiedIcon sx={{ fontSize: '14px !important', color: 'var(--color-accent) !important' }} />}
                                    label={t("Egypt's #1 Legal Network", 'شبكة قانونية رقم 1 في مصر')}
                                    size="small"
                                    sx={{
                                        bgcolor: 'rgba(var(--color-accent-rgb),0.08)',
                                        border: '1px solid rgba(var(--color-accent-rgb),0.2)',
                                        color: 'var(--color-text)',
                                        fontWeight: 700,
                                        fontSize: '0.75rem',
                                        height: '28px',
                                        paddingRight: '15px !important',
                                    }}
                                />
                            </Box>

                            {/* Headline */}
                            <Typography
                                variant="h1"
                                sx={{
                                    fontWeight: 900,
                                    color: 'var(--color-primary-dark)',
                                    fontSize: { xs: '2.5rem', sm: '3.2rem', md: '3.8rem' },
                                    lineHeight: 1.05,
                                    letterSpacing: '-0.02em',
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
                                    color: 'var(--color-secondary-text)',
                                    fontSize: '1.15rem',
                                    maxWidth: 540,
                                    lineHeight: 1.6,
                                }}
                            >
                                {t(
                                    'Egypt\'s first professional network built exclusively for verified licensed lawyers. Post a request, get notified colleagues respond, connect via WhatsApp — all in minutes.',
                                    'أول شبكة مهنية في مصر مبنية حصرياً للمحامين المرخصين الموثقين. انشر طلباً، يستجيب زملاؤك، تواصل عبر واتساب — كل ذلك في دقائق.',
                                )}
                            </Typography>

                            {/* CTAs */}
                            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap sx={{ pt: 1 }}>
                                <Button
                                    variant="contained"
                                    startIcon={<AppleIcon />}
                                    href={APP_STORE_URL}
                                    sx={{
                                        bgcolor: 'var(--color-primary)',
                                        color: 'var(--color-background)',
                                        fontWeight: 600,
                                        px: 4, py: 1.5, fontSize: '1rem', borderRadius: '12px',
                                        textTransform: 'none',
                                        boxShadow: '0 10px 25px -5px rgba(var(--color-primary-rgb), 0.4)',
                                        '& .MuiButton-startIcon': { ml: 0.5 },
                                        '&:hover': {
                                            bgcolor: 'var(--color-primary-dark)',
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 20px 30px -10px rgba(var(--color-primary-rgb), 0.5)',
                                        },
                                        transition: 'all 0.3s ease',
                                    }}
                                >
                                    {t('App Store', 'آب ستور')}
                                </Button>
                                <Button
                                    variant="outlined"
                                    startIcon={<GoogleIcon />}
                                    href={PLAY_STORE_URL}
                                    sx={{
                                        borderColor: 'var(--color-border)',
                                        color: 'var(--color-text)',
                                        bgcolor: 'var(--color-surface)',
                                        fontWeight: 600,
                                        px: 4, py: 1.5, fontSize: '1rem', borderRadius: '12px',
                                        textTransform: 'none',
                                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)',
                                        '& .MuiButton-startIcon': { ml: 0.5 },
                                        '&:hover': {
                                            borderColor: 'var(--color-primary)',
                                            bgcolor: 'var(--color-background)',
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 10px 20px -5px rgba(0,0,0,0.05)',
                                        },
                                        transition: 'all 0.3s ease',
                                    }}
                                >
                                    {t('Google Play', 'جوجل بلاي')}
                                </Button>
                            </Stack>

                            {/* Trust metrics */}
                            <Stack direction="row" spacing={3} sx={{ pt: 2, borderTop: '1px solid var(--color-border)' }}>
                                {[
                                    { v: t('Free', 'مجاني'), l: t('To Join', 'للانضمام') },
                                    { v: t('100%', '١٠٠٪'), l: t('Verified', 'موثق') },
                                    { v: t('27', '٢٧'), l: t('Governorates', 'محافظة') },
                                ].map((stat, i) => (
                                    <Box key={i}>
                                        <Typography sx={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--color-primary-dark)' }}>
                                            {stat.v}
                                        </Typography>
                                        <Typography sx={{ fontSize: '0.8rem', color: 'var(--color-secondary-text)', fontWeight: 500 }}>
                                            {stat.l}
                                        </Typography>
                                    </Box>
                                ))}
                            </Stack>
                        </Stack>
                    </Grid>

                    {/* ── App Mockup Column ── */}
                    <Grid size={{ xs: 12, lg: 6 }} sx={{ display: 'flex', justifyContent: { xs: 'center', lg: 'flex-end' }, position: 'relative' }}>
                        
                        {/* Decorative background shapes */}
                        <Box sx={{
                            position: 'absolute', top: '10%', right: '15%',
                            width: '300px', height: '400px',
                            bgcolor: 'var(--color-surface)',
                            borderRadius: '32px',
                            transform: 'rotate(6deg)',
                            zIndex: 0, border: '1px solid var(--color-border)',
                        }} />

                        {/* Floating elements */}
                        <Box sx={{
                            position: 'absolute', top: '20%', 
                            left: isRTL ? 'auto' : '0%',
                            right: isRTL ? '0%' : 'auto',
                            bgcolor: 'var(--color-background)', p: 2, borderRadius: 3,
                            boxShadow: '0 15px 35px rgba(0,0,0,0.05)',
                            border: '1px solid var(--color-border)',
                            zIndex: 2, display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1.5,
                            animation: 'floatUI 6s ease-in-out infinite',
                        }}>
                            <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: 'rgba(var(--color-accent-rgb), 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <VerifiedIcon sx={{ color: 'var(--color-accent)' }} />
                            </Box>
                            <Box>
                                <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-text)' }}>{t('Syndicate Verified', 'نقابة موثقة')}</Typography>
                                <Typography sx={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)' }}>{t('Ahmed Ali joined', 'انضم أحمد علي')}</Typography>
                            </Box>
                        </Box>

                        <Box sx={{ position: 'relative', zIndex: 1 }}>
                            {/* Phone shell */}
                            <Box
                                sx={{
                                    width: 290, height: 580,
                                    borderRadius: '40px',
                                    border: '10px solid var(--color-primary-dark)',
                                    bgcolor: 'var(--color-surface)',
                                    boxShadow: '0 25px 60px -10px rgba(var(--color-primary-rgb),0.2)',
                                    overflow: 'hidden',
                                    display: 'flex', flexDirection: 'column',
                                    position: 'relative',
                                }}
                            >
                                {/* iPhone Notch */}
                                <Box sx={{
                                    position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                                    width: 120, height: 24, bgcolor: 'var(--color-primary-dark)',
                                    borderBottomLeftRadius: 16, borderBottomRightRadius: 16, zIndex: 10
                                }} />

                                {/* App header */}
                                <Box sx={{ px: 2.5, pt: 5, pb: 2, bgcolor: 'var(--color-background)' }}>
                                    <Stack direction="row" alignItems="center" spacing={1.5}>
                                        <Box sx={{ width: 32, height: 32, borderRadius: '8px', bgcolor: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <BalanceIcon sx={{ fontSize: 18, color: 'var(--color-background)' }} />
                                        </Box>
                                        <Typography sx={{ color: 'var(--color-text)', fontWeight: 800, fontSize: { xs: '0.85rem', sm: '0.95rem' } }}>
                                            {t('Egypt Lawyers Network', 'شبكة المحامين المصريين')}
                                        </Typography>
                                    </Stack>
                                </Box>

                                {/* Content area */}
                                <Box sx={{ flex: 1, px: 2.5, py: 2, overflow: 'hidden' }}>
                                    <Typography sx={{ fontWeight: 600, mb: 2, fontSize: '0.9rem', color: 'var(--color-text)' }}>
                                        {t('Recent Requests', 'أحدث الطلبات')}
                                    </Typography>
                                    
                                    <Stack spacing={2}>
                                        {[
                                            { court: t('Cairo Court', 'محكمة القاهرة'), type: t('Hearing Attend', 'حضور جلسة'), time: '10m', color: 'var(--color-primary)' },
                                            { court: t('Alexandria Court', 'محكمة الإسكندرية'), type: t('Document Submit', 'تقديم مستند'), time: '1h', color: 'var(--color-accent)' },
                                            { court: t('Giza Court', 'محكمة الجيزة'), type: t('Inquiry', 'استعلام'), time: '2h', color: 'var(--color-secondary-text)' },
                                        ].map((card, i) => (
                                            <Box key={i} sx={{
                                                bgcolor: 'var(--color-background)', p: 2, borderRadius: 3,
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.03)', border: '1px solid var(--color-border)',
                                            }}>
                                                <Stack direction="row" justifyContent="space-between" mb={1}>
                                                    <Typography sx={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--color-text)' }}>{card.court}</Typography>
                                                    <Typography sx={{ fontSize: '0.7rem', color: 'var(--color-secondary-text)' }}>{card.time}</Typography>
                                                </Stack>
                                                <Box sx={{ display: 'inline-flex', px: 1, py: 0.5, borderRadius: 1, bgcolor: `rgba(${i === 0 ? 'var(--color-primary-rgb)' : (i === 1 ? '34,197,94' : '100,116,139')}, 0.1)` }}>
                                                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: card.color }}>{card.type}</Typography>
                                                </Box>
                                                {/* skeleton lines */}
                                                <Stack spacing={0.75} mt={1.5}>
                                                    <Box sx={{ height: 6, borderRadius: 3, bgcolor: 'var(--color-surface)', width: '100%' }} />
                                                    <Box sx={{ height: 6, borderRadius: 3, bgcolor: 'var(--color-surface)', width: '60%' }} />
                                                </Stack>
                                            </Box>
                                        ))}
                                    </Stack>
                                </Box>

                                {/* Bottom Nav */}
                                <Box sx={{ height: 64, bgcolor: 'var(--color-background)', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', pb: 1 }}>
                                    <Box sx={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid var(--color-secondary-text)', opacity: 0.5 }} />
                                    <Box sx={{ width: 42, height: 42, borderRadius: '14px', bgcolor: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(var(--color-primary-rgb), 0.2)' }}>
                                        <Typography sx={{ color: 'var(--color-background)', fontSize: '1.5rem', fontWeight: 600, lineHeight: 1 }}>+</Typography>
                                    </Box>
                                    <Box sx={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid var(--color-secondary-text)', opacity: 0.5 }} />
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Container>

            <style>{`
                @keyframes floatUI {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-12px); }
                }
            `}</style>
        </Box>
    );
}
