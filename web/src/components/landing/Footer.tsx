import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BalanceIcon from '@mui/icons-material/Balance';
import { useLang } from '../../contexts/LanguageContext';

const quickLinks = [
    { en: 'Home', ar: 'الرئيسية', href: '#home' },
    { en: 'How It Works', ar: 'كيف يعمل', href: '#how-it-works' },
    { en: 'Features', ar: 'المميزات', href: '#features' },
    { en: 'Download', ar: 'تحميل', href: '#download' },
];

export default function Footer() {
    const { t } = useLang();

    const scrollTo = (href: string) => {
        const el = document.querySelector(href);
        el?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <Box sx={{ bgcolor: 'var(--color-primary-dark)', borderTop: '1px solid rgba(var(--color-surface-rgb),0.5)', pt: 8, pb: 4 }}>
            <Container maxWidth="lg">
                <Grid container spacing={6} sx={{ mb: 6 }}>
                    {/* Brand */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Stack spacing={2}>
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ gap: "8px" }}>
                                <Box
                                    sx={{
                                        width: 36, height: 36, borderRadius: '50%', bgcolor: 'var(--color-primary)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}
                                >
                                    <BalanceIcon sx={{ fontSize: 20, color: 'var(--color-background)' }} />
                                </Box>
                                <Typography sx={{ color: 'var(--color-background)', fontWeight: 700 }}>
                                    {t('Egyptian Lawyers Network', 'شبكة المحامين المصريين')}
                                </Typography>
                            </Stack>
                            <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', lineHeight: 1.7, maxWidth: 300 }}>
                                {t(
                                    'A trusted professional network connecting licensed lawyers across all Egyptian courts and cities.',
                                    'شبكة مهنية موثوقة تربط المحامين المرخصين عبر جميع المحاكم والمدن المصرية.',
                                )}
                            </Typography>
                        </Stack>
                    </Grid>

                    {/* Quick Links */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Typography sx={{ color: 'var(--color-background)', fontWeight: 700, mb: 2 }}>
                            {t('Quick Links', 'روابط سريعة')}
                        </Typography>
                        <Stack spacing={1}>
                            {quickLinks.map((link) => (
                                <Typography
                                    key={link.href}
                                    component="button"
                                    onClick={() => scrollTo(link.href)}
                                    sx={{
                                        background: 'none', border: 'none', cursor: 'pointer', textAlign: 'start', p: 0,
                                        color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem',
                                        transition: 'color 0.2s',
                                        '&:hover': { color: 'var(--color-accent)' },
                                    }}
                                >
                                    {t(link.en, link.ar)}
                                </Typography>
                            ))}
                        </Stack>
                    </Grid>

                    {/* Contact */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Typography sx={{ color: 'var(--color-background)', fontWeight: 700, mb: 2 }}>
                            {t('Contact', 'تواصل معنا')}
                        </Typography>
                        <Stack spacing={1.5}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <EmailIcon sx={{ fontSize: 16, color: 'rgba(255,255,255,0.6)' }} />
                                <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>
                                    info@egyptlawyers.net
                                </Typography>
                            </Stack>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <PhoneIcon sx={{ fontSize: 16, color: 'rgba(255,255,255,0.6)' }} />
                                <Typography dir="ltr" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>
                                    +20 100 000 0000
                                </Typography>
                            </Stack>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <LocationOnIcon sx={{ fontSize: 16, color: 'rgba(255,255,255,0.6)' }} />
                                <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>
                                    {t('Cairo, Egypt', 'القاهرة، مصر')}
                                </Typography>
                            </Stack>
                        </Stack>
                    </Grid>
                </Grid>

                {/* Copyright */}
                <Box sx={{ borderTop: '1px solid rgba(var(--color-surface-rgb),0.5)', pt: 3, textAlign: 'center' }}>
                    <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>
                        © 2026 {t('Egyptian Lawyers Network. All rights reserved.', 'شبكة المحامين المصريين. جميع الحقوق محفوظة.')}
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}
