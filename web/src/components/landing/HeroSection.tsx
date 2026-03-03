import { Box, Button, Container, Grid, Stack, Typography } from '@mui/material';
import AppleIcon from '@mui/icons-material/Apple';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import BalanceIcon from '@mui/icons-material/Balance';
import { useLang } from '../../contexts/LanguageContext';

export default function HeroSection() {
    const { t } = useLang();

    return (
        <Box
            id="home"
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                bgcolor: '#0F172A',
                position: 'relative',
                overflow: 'hidden',
                pt: { xs: 4, md: 0 },
            }}
        >
            {/* Background radial glow */}
            <Box
                sx={{
                    position: 'absolute', inset: 0, opacity: 0.08,
                    background: `radial-gradient(circle at 25% 25%, rgba(212,175,55,0.25) 0%, transparent 50%),
                       radial-gradient(circle at 75% 75%, rgba(212,175,55,0.15) 0%, transparent 50%)`,
                }}
            />

            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: { xs: 6, md: 10 } }}>
                <Grid container spacing={6} alignItems="center">
                    {/* Text */}
                    <Grid size={{ xs: 12, lg: 6 }}>
                        <Stack spacing={4}>
                            <Box
                                sx={{
                                    display: 'inline-flex', alignSelf: 'flex-start',
                                    px: 2.5, py: 0.75, borderRadius: 50,
                                    bgcolor: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)',
                                }}
                            >
                                <Typography sx={{ color: '#D4AF37', fontSize: '0.85rem', fontWeight: 600 }}>
                                    {t('For Licensed Lawyers Only', 'للمحامين المرخصين فقط')}
                                </Typography>
                            </Box>

                            <Typography
                                variant="h2"
                                sx={{
                                    fontWeight: 800, color: '#F8FAFC',
                                    fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.4rem' },
                                    lineHeight: 1.15,
                                }}
                            >
                                {t('Connect with Trusted Lawyers Across Egypt', 'تواصل مع محامين موثوقين في جميع أنحاء مصر')}
                            </Typography>

                            <Typography sx={{ color: 'rgba(212,175,55,0.6)', fontSize: '1.1rem', maxWidth: 520, lineHeight: 1.7 }}>
                                {t(
                                    'A professional network built exclusively for Egyptian lawyers. Find legal support by court and city, collaborate efficiently, and grow your practice.',
                                    'شبكة مهنية حصرية للمحامين المصريين. ابحث عن دعم قانوني حسب المحكمة والمدينة، وتعاون بكفاءة، وطوّر ممارستك المهنية.',
                                )}
                            </Typography>

                            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                                <Button
                                    variant="contained"
                                    startIcon={<AppleIcon />}
                                    sx={{
                                        bgcolor: '#D4AF37', color: '#0F172A', fontWeight: 700,
                                        px: 4, py: 1.5, fontSize: '1rem', borderRadius: 2,
                                        '&:hover': { bgcolor: '#B8962E' },
                                    }}
                                >
                                    {t('App Store', 'آب ستور')}
                                </Button>
                                <Button
                                    variant="contained"
                                    startIcon={<PlayArrowIcon />}
                                    sx={{
                                        bgcolor: '#D4AF37', color: '#0F172A', fontWeight: 700,
                                        px: 4, py: 1.5, fontSize: '1rem', borderRadius: 2,
                                        '&:hover': { bgcolor: '#B8962E' },
                                    }}
                                >
                                    {t('Google Play', 'جوجل بلاي')}
                                </Button>
                            </Stack>
                        </Stack>
                    </Grid>

                    {/* Phone mockup */}
                    <Grid size={{ xs: 12, lg: 6 }} sx={{ display: 'flex', justifyContent: { xs: 'center', lg: 'flex-end' } }}>
                        <Box sx={{ position: 'relative' }}>
                            <Box
                                sx={{
                                    width: 256, height: 500,
                                    borderRadius: '3rem', border: '2px solid rgba(212,175,55,0.3)',
                                    bgcolor: '#1E293B',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    boxShadow: '0 25px 50px rgba(212,175,55,0.08)',
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 224, height: 470, borderRadius: '2.5rem',
                                        background: 'linear-gradient(135deg, #0B1120, #0F172A)',
                                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                                        justifyContent: 'center', gap: 2, p: 3,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 64, height: 64, borderRadius: '50%',
                                            bgcolor: 'rgba(212,175,55,0.15)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}
                                    >
                                        <BalanceIcon sx={{ fontSize: 32, color: '#D4AF37' }} />
                                    </Box>
                                    <Typography sx={{ color: '#D4AF37', fontWeight: 700, fontSize: '0.85rem', textAlign: 'center' }}>
                                        {t('Egyptian Lawyers Network', 'شبكة المحامين المصريين')}
                                    </Typography>
                                    <Stack spacing={1.5} sx={{ width: '100%', mt: 2 }}>
                                        {[1, 2, 3].map((i) => (
                                            <Box
                                                key={i}
                                                sx={{
                                                    height: 48, borderRadius: 3,
                                                    bgcolor: 'rgba(212,175,55,0.04)',
                                                    border: '1px solid rgba(212,175,55,0.08)',
                                                }}
                                            />
                                        ))}
                                    </Stack>
                                </Box>
                            </Box>
                            {/* glow */}
                            <Box
                                sx={{
                                    position: 'absolute', inset: -40, borderRadius: '50%',
                                    bgcolor: 'rgba(212,175,55,0.04)', filter: 'blur(40px)', zIndex: -1,
                                }}
                            />
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
