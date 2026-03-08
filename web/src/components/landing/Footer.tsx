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
    { en: 'Why Join', ar: 'لماذا تنضم', href: '#why-join' },
    { en: 'FAQ', ar: 'الأسئلة الشائعة', href: '#faq' },
    { en: 'Download', ar: 'تحميل', href: '#download' },
];

const legalLinks = [
    { en: 'Privacy Policy', ar: 'سياسة الخصوصية', href: '/privacy-policy' },
    { en: 'Terms of Service', ar: 'شروط الاستخدام', href: '/terms-of-service' },
    { en: 'Cookie Policy', ar: 'سياسة الكوكيز', href: '/cookie-policy' },
];

export default function Footer() {
    const { t } = useLang();

    const scrollTo = (href: string) => {
        const el = document.querySelector(href);
        el?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <Box
            sx={{
                bgcolor: 'var(--color-primary-dark)',
                borderTop: '1px solid rgba(var(--color-surface-rgb),0.4)',
                pt: 8, pb: 4,
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={6} sx={{ mb: 6 }}>
                    {/* Brand + About */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Stack spacing={2.5}>
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ gap: '10px' }}>
                                <Box
                                    sx={{
                                        width: 38, height: 38, borderRadius: '50%', bgcolor: 'var(--color-primary)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}
                                >
                                    <BalanceIcon sx={{ fontSize: 20, color: '#fff' }} />
                                </Box>
                                <Typography sx={{ color: 'var(--color-background)', fontWeight: 700, fontSize: '1rem' }}>
                                    {t('Egyptian Lawyers Network', 'شبكة المحامين المصريين')}
                                </Typography>
                            </Stack>
                            <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.85rem', lineHeight: 1.8, maxWidth: 300 }}>
                                {t(
                                    'A trusted professional network connecting verified licensed lawyers across all Egyptian courts and governorates. Built by legal professionals, for legal professionals.',
                                    'شبكة مهنية موثوقة تربط المحامين المرخصين الموثقين عبر جميع المحاكم والمحافظات المصرية. مبنية من قبل متخصصين قانونيين، للمتخصصين القانونيين.',
                                )}
                            </Typography>

                            {/* Trust badge */}
                            <Box
                                sx={{
                                    display: 'inline-flex',
                                    alignSelf: 'flex-start',
                                    px: 2, py: 0.75,
                                    borderRadius: 50,
                                    border: '1px solid rgba(var(--color-primary-rgb),0.35)',
                                    bgcolor: 'rgba(var(--color-primary-rgb),0.08)',
                                }}
                            >
                                <Typography sx={{ color: 'var(--color-primary)', fontSize: '0.75rem', fontWeight: 600 }}>
                                    {t('🔒 Egyptian Bar Association Verified', '🔒 موثق بنقابة المحامين المصريين')}
                                </Typography>
                            </Box>
                        </Stack>
                    </Grid>

                    {/* Quick Links */}
                    <Grid size={{ xs: 6, md: 2 }}>
                        <Typography sx={{ color: 'var(--color-background)', fontWeight: 700, mb: 2.5, fontSize: '0.9rem' }}>
                            {t('Quick Links', 'روابط سريعة')}
                        </Typography>
                        <Stack spacing={1.25}>
                            {quickLinks.map((link) => (
                                <Typography
                                    key={link.href}
                                    component="button"
                                    onClick={() => scrollTo(link.href)}
                                    sx={{
                                        background: 'none', border: 'none', cursor: 'pointer',
                                        textAlign: 'start', p: 0,
                                        color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem',
                                        transition: 'color 0.2s',
                                        '&:hover': { color: 'var(--color-accent)' },
                                    }}
                                >
                                    {t(link.en, link.ar)}
                                </Typography>
                            ))}
                        </Stack>
                    </Grid>

                    {/* Legal */}
                    <Grid size={{ xs: 6, md: 2 }}>
                        <Typography sx={{ color: 'var(--color-background)', fontWeight: 700, mb: 2.5, fontSize: '0.9rem' }}>
                            {t('Legal', 'قانوني')}
                        </Typography>
                        <Stack spacing={1.25}>
                            {legalLinks.map((link) => (
                                <Typography
                                    key={link.href}
                                    component="a"
                                    href={link.href}
                                    sx={{
                                        color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem',
                                        textDecoration: 'none',
                                        transition: 'color 0.2s',
                                        '&:hover': { color: 'var(--color-accent)' },
                                        display: 'block',
                                    }}
                                >
                                    {t(link.en, link.ar)}
                                </Typography>
                            ))}
                        </Stack>
                    </Grid>

                    {/* Contact */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Typography sx={{ color: 'var(--color-background)', fontWeight: 700, mb: 2.5, fontSize: '0.9rem' }}>
                            {t('Contact Us', 'تواصل معنا')}
                        </Typography>
                        <Stack spacing={2}>
                            <Stack direction="row" alignItems="center" spacing={1.5}>
                                <Box sx={{ width: 32, height: 32, borderRadius: 1.5, bgcolor: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <EmailIcon sx={{ fontSize: 16, color: 'rgba(255,255,255,0.55)' }} />
                                </Box>
                                <Typography
                                    component="a"
                                    href="mailto:info@egyptlawyers.net"
                                    sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.85rem', textDecoration: 'none', '&:hover': { color: 'var(--color-accent)' }, transition: 'color 0.2s' }}
                                >
                                    info@egyptlawyers.net
                                </Typography>
                            </Stack>
                            <Stack direction="row" alignItems="center" spacing={1.5}>
                                <Box sx={{ width: 32, height: 32, borderRadius: 1.5, bgcolor: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <PhoneIcon sx={{ fontSize: 16, color: 'rgba(255,255,255,0.55)' }} />
                                </Box>
                                <Typography dir="ltr" sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.85rem' }}>
                                    +20 100 000 0000
                                </Typography>
                            </Stack>
                            <Stack direction="row" alignItems="center" spacing={1.5}>
                                <Box sx={{ width: 32, height: 32, borderRadius: 1.5, bgcolor: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <LocationOnIcon sx={{ fontSize: 16, color: 'rgba(255,255,255,0.55)' }} />
                                </Box>
                                <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.85rem' }}>
                                    {t('Cairo, Egypt', 'القاهرة، مصر')}
                                </Typography>
                            </Stack>
                        </Stack>
                    </Grid>
                </Grid>

                {/* Bottom bar */}
                <Box
                    sx={{
                        borderTop: '1px solid rgba(var(--color-surface-rgb),0.4)',
                        pt: 3,
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 1,
                    }}
                >
                    <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>
                        © 2026 {t('Egyptian Lawyers Network. All rights reserved.', 'شبكة المحامين المصريين. جميع الحقوق محفوظة.')}
                    </Typography>
                    <Stack direction="row" spacing={2}>
                        {legalLinks.map((link) => (
                            <Typography
                                key={link.href}
                                component="a"
                                href={link.href}
                                sx={{
                                    color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem',
                                    textDecoration: 'none',
                                    '&:hover': { color: 'rgba(255,255,255,0.65)' },
                                    transition: 'color 0.2s',
                                }}
                            >
                                {t(link.en, link.ar)}
                            </Typography>
                        ))}
                    </Stack>
                </Box>
            </Container>
        </Box>
    );
}
