import { Box, Button, Container, Grid, Stack, Typography } from '@mui/material';
import AppleIcon from '@mui/icons-material/Apple';
import GoogleIcon from '@mui/icons-material/Google';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useLang } from '../../contexts/LanguageContext';

// QR code pointing to the play store link — update once the app is live
const QR_CODE_URL = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&bgcolor=1a2332&color=4F8EF7&data=https://play.google.com/store&format=svg`;

const APP_STORE_URL = '#';
const PLAY_STORE_URL = '#';

const perks = [
    { en: 'Free to download & join', ar: 'مجاني للتحميل والانضمام' },
    { en: 'No subscription fees', ar: 'بدون رسوم اشتراك' },
    { en: 'Available on iOS & Android', ar: 'متاح على iOS وAndroid' },
    { en: 'Verified lawyers only', ar: 'محامون موثقون فقط' },
];

export default function DownloadCTA() {
    const { t } = useLang();

    return (
        <Box
            id="download"
            sx={{
                py: { xs: 10, md: 14 },
                bgcolor: 'var(--color-primary-dark)',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Background glow */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 700, height: 700,
                    bgcolor: 'rgba(var(--color-primary-rgb),0.1)',
                    borderRadius: '50%',
                    filter: 'blur(100px)',
                }}
            />
            {/* Corner accent */}
            <Box
                sx={{
                    position: 'absolute',
                    bottom: -80, right: -80,
                    width: 320, height: 320,
                    bgcolor: 'rgba(var(--color-accent-rgb),0.08)',
                    borderRadius: '50%',
                    filter: 'blur(60px)',
                }}
            />

            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                <Grid container spacing={6} alignItems="center">
                    {/* Left: Text + Buttons */}
                    <Grid size={{ xs: 12, md: 7 }}>
                        <Stack spacing={4}>
                            <Typography
                                sx={{
                                    color: 'var(--color-accent)', fontWeight: 600, fontSize: '0.8rem',
                                    textTransform: 'uppercase', letterSpacing: 2,
                                }}
                            >
                                {t('Download the App', 'حمّل التطبيق')}
                            </Typography>

                            <Typography
                                variant="h3"
                                sx={{
                                    fontWeight: 900, color: 'var(--color-background)',
                                    fontSize: { xs: '1.8rem', md: '2.8rem' },
                                    lineHeight: 1.15,
                                    letterSpacing: '-0.5px',
                                }}
                            >
                                {t('Ready to Join the Network?', 'مستعد للانضمام إلى الشبكة؟')}
                            </Typography>

                            <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.05rem', lineHeight: 1.8, maxWidth: 500 }}>
                                {t(
                                    'Download the app today and connect with thousands of verified lawyers across Egypt. Your next case partner is just a tap away.',
                                    'حمّل التطبيق اليوم وتواصل مع آلاف المحامين الموثقين في جميع أنحاء مصر. شريكك القانوني القادم على بعد نقرة واحدة.',
                                )}
                            </Typography>

                            {/* Perks */}
                            <Grid container spacing={1}>
                                {perks.map((perk, i) => (
                                    <Grid key={i} size={{ xs: 12, sm: 6 }}>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <CheckCircleIcon sx={{ fontSize: 18, color: '#22C55E', flexShrink: 0 }} />
                                            <Typography sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.875rem' }}>
                                                {t(perk.en, perk.ar)}
                                            </Typography>
                                        </Stack>
                                    </Grid>
                                ))}
                            </Grid>

                            {/* CTA Buttons */}
                            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                                <Button
                                    variant="contained"
                                    startIcon={<AppleIcon />}
                                    href={APP_STORE_URL}
                                    sx={{
                                        bgcolor: 'var(--color-background)',
                                        color: 'var(--color-primary-dark)',
                                        fontWeight: 700,
                                        px: 3.5, py: 1.5, fontSize: '1rem', borderRadius: 2,
                                        '& .MuiButton-startIcon': { ml: 0.5 },
                                        '&:hover': {
                                            bgcolor: 'rgba(255,255,255,0.9)',
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                                        },
                                        transition: 'all 0.25s',
                                    }}
                                >
                                    {t('Download on App Store', 'حمّل من آب ستور')}
                                </Button>
                                <Button
                                    variant="contained"
                                    startIcon={<GoogleIcon />}
                                    href={PLAY_STORE_URL}
                                    sx={{
                                        bgcolor: 'var(--color-accent)', color: 'var(--color-background)',
                                        fontWeight: 700,
                                        px: 3.5, py: 1.5, fontSize: '1rem', borderRadius: 2,
                                        '& .MuiButton-startIcon': { ml: 0.5 },
                                        '&:hover': {
                                            bgcolor: '#e68336',
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 8px 24px rgba(var(--color-accent-rgb),0.45)',
                                        },
                                        transition: 'all 0.25s',
                                    }}
                                >
                                    {t('Get it on Google Play', 'احصل عليه من جوجل بلاي')}
                                </Button>
                            </Stack>
                        </Stack>
                    </Grid>

                    {/* Right: QR Code */}
                    <Grid size={{ xs: 12, md: 5 }} sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
                        <Stack alignItems="center" spacing={2}>
                            <Box
                                sx={{
                                    p: 2.5,
                                    borderRadius: 4,
                                    bgcolor: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    backdropFilter: 'blur(8px)',
                                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                                }}
                            >
                                <Box
                                    component="img"
                                    src={QR_CODE_URL}
                                    alt={t('QR code to download the app', 'رمز QR لتحميل التطبيق')}
                                    sx={{
                                        width: 160, height: 160,
                                        display: 'block',
                                        borderRadius: 2,
                                    }}
                                />
                            </Box>
                            <Typography
                                sx={{
                                    color: 'rgba(255,255,255,0.5)',
                                    fontSize: '0.8rem',
                                    textAlign: 'center',
                                    maxWidth: 180,
                                    lineHeight: 1.5,
                                }}
                            >
                                {t(
                                    'Scan with your phone camera to download instantly',
                                    'امسح بكاميرا هاتفك للتحميل فوراً',
                                )}
                            </Typography>
                        </Stack>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
