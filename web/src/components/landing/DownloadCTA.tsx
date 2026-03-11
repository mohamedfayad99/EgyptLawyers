import { Box, Button, Container, Grid, Stack, Typography } from '@mui/material';
import AppleIcon from '@mui/icons-material/Apple';
import GoogleIcon from '@mui/icons-material/Google';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useLang } from '../../contexts/LanguageContext';

const QR_CODE_URL = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&bgcolor=09090B&color=FFFFFF&data=https://play.google.com/store&format=svg`;

const APP_STORE_URL = '#';
const PLAY_STORE_URL = '#';

const perks = [
    { en: 'Free forever', ar: 'مجاني دائماً' },
    { en: '100% Verified lawyers', ar: 'محامون موثقون 100%' },
    { en: 'Secure & private', ar: 'آمن وخاص' },
    { en: '27 Governorates', ar: '27 محافظة' },
];

export default function DownloadCTA() {
    const { t } = useLang();

    return (
        <Box
            id="download"
            sx={{
                py: { xs: 12, md: 16 },
                bgcolor: 'var(--color-surface)',
                position: 'relative',
                overflow: 'hidden',
                color: 'var(--color-text)',
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '30%', left: '20%',
                    transform: 'translate(-50%, -50%)',
                    width: 800, height: 800,
                    background: 'radial-gradient(circle, rgba(var(--color-accent-rgb),0.1) 0%, transparent 70%)',
                    borderRadius: '50%',
                    filter: 'blur(100px)',
                    zIndex: 0,
                }}
            />

            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                <Box
                    sx={{
                        bgcolor: 'var(--color-background)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '32px',
                        p: { xs: 4, md: 8 },
                        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.4)',
                    }}
                >
                    <Grid container spacing={8} alignItems="center">
                        <Grid size={{ xs: 12, md: 7 }}>
                            <Stack spacing={4}>
                                <Box
                                    sx={{
                                        display: 'inline-flex', px: 2, py: 0.75, borderRadius: '12px',
                                        bgcolor: 'rgba(var(--color-accent-rgb),0.15)', border: '1px solid rgba(var(--color-accent-rgb),0.3)', width: 'max-content'
                                    }}
                                >
                                    <Typography sx={{ color: 'var(--color-accent)', fontWeight: 800, fontSize: '0.8rem', letterSpacing: 1 }}>
                                        {t('Get Started Today', 'ابدأ اليوم')}
                                    </Typography>
                                </Box>

                                <Typography
                                    variant="h2"
                                    sx={{
                                        fontWeight: 900,
                                        fontSize: { xs: '2.5rem', md: '3.5rem' },
                                        lineHeight: 1.1,
                                        letterSpacing: '-0.02em',
                                    }}
                                >
                                    {t('Ready to Join the Network?', 'مستعد للانضمام إلى الشبكة؟')}
                                </Typography>

                                <Typography sx={{ color: 'var(--color-secondary-text)', fontSize: '1.2rem', lineHeight: 1.6, maxWidth: 520 }}>
                                    {t(
                                        'Download the app today and connect with thousands of verified lawyers across Egypt. Your next case partner is just a tap away.',
                                        'حمّل التطبيق اليوم وتواصل مع آلاف المحامين الموثقين في جميع أنحاء مصر. شريكك القانوني القادم على بعد نقرة واحدة.',
                                    )}
                                </Typography>

                                <Grid container spacing={2}>
                                    {perks.map((perk, i) => (
                                        <Grid key={i} size={{ xs: 6 }}>
                                            <Stack direction="row" spacing={1.5} alignItems="center">
                                                <CheckCircleIcon sx={{ fontSize: 20, color: 'var(--color-accent)', flexShrink: 0 }} />
                                                <Typography sx={{ color: 'var(--color-text)', fontSize: '0.95rem', fontWeight: 500 }}>
                                                    {t(perk.en, perk.ar)}
                                                </Typography>
                                            </Stack>
                                        </Grid>
                                    ))}
                                </Grid>

                                <Stack direction="row" spacing={2.5} flexWrap="wrap" useFlexGap sx={{ pt: 2 }}>
                                    <Button
                                        variant="contained"
                                        startIcon={<AppleIcon />}
                                        href={APP_STORE_URL}
                                        sx={{
                                            bgcolor: 'var(--color-primary)', color: 'var(--color-background)',
                                            fontWeight: 700, px: 4, py: 1.8, fontSize: '1.1rem', borderRadius: '16px',
                                            textTransform: 'none', boxShadow: '0 10px 30px -10px rgba(var(--color-primary-rgb),0.2)',
                                            '& .MuiButton-startIcon': { ml: 0.5 },
                                            '&:hover': {
                                                bgcolor: 'var(--color-primary-dark)',
                                                transform: 'translateY(-4px)',
                                            },
                                            transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
                                        }}
                                    >
                                        {t('App Store', 'آب ستور')}
                                    </Button>
                                    <Button
                                        variant="contained"
                                        startIcon={<GoogleIcon />}
                                        href={PLAY_STORE_URL}
                                        sx={{
                                            bgcolor: 'var(--color-accent)', color: '#ffffff',
                                            fontWeight: 700, px: 4, py: 1.8, fontSize: '1.1rem', borderRadius: '16px',
                                            textTransform: 'none', boxShadow: '0 10px 30px -10px rgba(var(--color-accent-rgb),0.3)',
                                            '& .MuiButton-startIcon': { ml: 0.5 },
                                            '&:hover': {
                                                bgcolor: '#16a34a',
                                                transform: 'translateY(-4px)',
                                            },
                                            transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
                                        }}
                                    >
                                        {t('Google Play', 'جوجل بلاي')}
                                    </Button>
                                </Stack>
                            </Stack>
                        </Grid>

                        <Grid size={{ xs: 12, md: 5 }} sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
                            <Box sx={{ position: 'relative' }}>
                                <Stack alignItems="center" spacing={3} sx={{ position: 'relative', zIndex: 1, p: 4 }}>
                                    <Box
                                        sx={{
                                            p: 3, borderRadius: '24px', bgcolor: 'var(--color-surface)',
                                            border: '1px solid var(--color-border)',
                                            boxShadow: '0 20px 40px rgba(0,0,0,0.3)', display: 'inline-flex'
                                        }}
                                    >
                                        <Box
                                            component="img"
                                            src={QR_CODE_URL}
                                            alt={t('QR code to download the app', 'رمز QR لتحميل التطبيق')}
                                            sx={{ width: 180, height: 180, display: 'block', borderRadius: '12px' }}
                                        />
                                    </Box>
                                    <Typography
                                        sx={{
                                            color: 'var(--color-secondary-text)', fontSize: '1rem',
                                            textAlign: 'center', maxWidth: 220, lineHeight: 1.6, fontWeight: 500,
                                        }}
                                    >
                                        {t(
                                            'Scan with your phone camera to download instantly',
                                            'امسح بكاميرا هاتفك للتحميل فوراً',
                                        )}
                                    </Typography>
                                </Stack>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </Box>
    );
}
