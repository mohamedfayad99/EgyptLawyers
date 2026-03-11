import { useState } from 'react';
import {
    AppBar, Toolbar, Box, Button, IconButton, Drawer, List, ListItemButton,
    ListItemText, Typography, Container, Stack, useMediaQuery, useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import BalanceIcon from '@mui/icons-material/Balance';
import DownloadIcon from '@mui/icons-material/Download';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useLang } from '../../contexts/LanguageContext';
import { useAppTheme } from '../../contexts/ThemeContext';

const navLinks = [
    { en: 'Home', ar: 'الرئيسية', href: '#home' },
    { en: 'How It Works', ar: 'كيف يعمل', href: '#how-it-works' },
    { en: 'Features', ar: 'المميزات', href: '#features' },
    { en: 'FAQ', ar: 'الأسئلة', href: '#faq' },
];

export default function Navbar() {
    const { t, toggleLang, lang } = useLang();
    const { mode, toggleTheme } = useAppTheme();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const scrollTo = (href: string) => {
        setDrawerOpen(false);
        const el = document.querySelector(href);
        el?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <>
            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    bgcolor: 'rgba(var(--color-background-rgb),0.85)',
                    backdropFilter: 'blur(16px)',
                    borderBottom: '1px solid var(--color-border)',
                    color: 'var(--color-text)',
                }}
            >
                <Container maxWidth="lg">
                    <Toolbar disableGutters sx={{ height: 76 }}>
                        {/* Logo */}
                        <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                            onClick={() => scrollTo('#home')}
                            sx={{
                                flexGrow: { xs: 1, md: 0 },
                                gap: '10px',
                                cursor: 'pointer',
                                '&:hover': { opacity: 0.9 }
                            }}
                        >
                            <Box
                                sx={{
                                    width: 40, height: 40, borderRadius: '12px',
                                    bgcolor: 'var(--color-primary-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    boxShadow: '0 4px 12px rgba(var(--color-primary-rgb),0.2)',
                                }}
                            >
                                <BalanceIcon sx={{ fontSize: 22, color: 'var(--color-background)' }} />
                            </Box>
                            <Typography
                                sx={{
                                    fontWeight: 800, color: 'var(--color-primary-dark)', fontSize: '1.2rem',
                                    display: { xs: 'none', sm: 'block' },
                                    fontFamily: '"Inter", sans-serif', letterSpacing: '-0.02em'
                                }}
                            >
                                {t('Egypt Lawyers Network', 'شبكة المحامين المصريين')}
                            </Typography>
                        </Stack>

                        {/* Desktop Links */}
                        {!isMobile && (
                            <Stack direction="row" spacing={0.5} alignItems="center" sx={{ ml: 'auto', mr: 2 }}>
                                {navLinks.map((link) => (
                                    <Button
                                        key={link.href}
                                        onClick={() => scrollTo(link.href)}
                                        sx={{
                                            color: 'var(--color-secondary-text)',
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            fontSize: '0.9rem',
                                            px: 2,
                                            borderRadius: '8px',
                                            '&:hover': {
                                                color: 'var(--color-primary-dark)',
                                                bgcolor: 'var(--color-surface)',
                                            },
                                        }}
                                    >
                                        {t(link.en, link.ar)}
                                    </Button>
                                ))}
                                <Button
                                    href="/admin"
                                    sx={{
                                        color: 'var(--color-primary)',
                                        textTransform: 'none',
                                        fontWeight: 700,
                                        fontSize: '0.9rem',
                                        px: 2,
                                        borderRadius: '8px',
                                        '&:hover': {
                                            bgcolor: 'rgba(var(--color-primary-rgb), 0.08)',
                                        },
                                    }}
                                >
                                    {t('Dashboard', 'لوحة التحكم')}
                                </Button>
                            </Stack>
                        )}

                        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ ml: isMobile ? 'auto' : 0 }}>
                            {/* Language toggle */}
                            <Button
                                onClick={toggleLang}
                                variant="text"
                                size="small"
                                sx={{
                                    color: 'var(--color-primary-dark)',
                                    textTransform: 'none',
                                    fontWeight: 700,
                                    fontSize: '0.85rem',
                                    minWidth: 48,
                                    borderRadius: '8px',
                                    '&:hover': {
                                        bgcolor: 'var(--color-surface)',
                                    },
                                }}
                            >
                                {lang === 'en' ? 'عربي' : 'EN'}
                            </Button>

                            {/* Theme toggle */}
                            <IconButton
                                onClick={toggleTheme}
                                sx={{
                                    color: 'var(--color-primary-dark)',
                                    bgcolor: 'var(--color-surface)',
                                    borderRadius: '8px',
                                    p: 1,
                                    '&:hover': { bgcolor: 'rgba(var(--color-primary-rgb), 0.1)' },
                                }}
                            >
                                {mode === 'dark' ? <LightModeIcon sx={{ fontSize: 20 }} /> : <DarkModeIcon sx={{ fontSize: 20 }} />}
                            </IconButton>

                            {/* JOIN NOW — primary CTA */}
                            {!isMobile && (
                                <Button
                                    onClick={() => scrollTo('#download')}
                                    variant="contained"
                                    startIcon={<DownloadIcon />}
                                    sx={{
                                        bgcolor: 'var(--color-primary)',
                                        color: 'var(--color-background)',
                                        fontWeight: 700,
                                        fontSize: '0.95rem',
                                        textTransform: 'none',
                                        borderRadius: '12px',
                                        px: 3, py: 1,
                                        boxShadow: '0 4px 12px rgba(var(--color-primary-rgb),0.3)',
                                        '& .MuiButton-startIcon': { ml: 0.5 },
                                        '&:hover': {
                                            bgcolor: 'var(--color-primary-dark)',
                                            transform: 'translateY(-1px)',
                                            boxShadow: '0 6px 16px rgba(var(--color-primary-rgb),0.4)',
                                        },
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    {t('Join Now', 'انضم الآن')}
                                </Button>
                            )}

                            {/* Mobile menu icon */}
                            {isMobile && (
                                <IconButton onClick={() => setDrawerOpen((o) => !o)} sx={{ color: 'var(--color-primary-dark)' }}>
                                    <MenuIcon />
                                </IconButton>
                            )}
                        </Stack>
                    </Toolbar>
                </Container>
            </AppBar>

            {/* Mobile Drawer */}
            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                PaperProps={{
                    sx: {
                        width: 280,
                        bgcolor: 'var(--color-background)',
                        borderLeft: '1px solid var(--color-border)',
                    },
                }}
            >
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)' }}>
                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        onClick={() => scrollTo('#home')}
                        sx={{ cursor: 'pointer', '&:hover': { opacity: 0.9 } }}
                    >
                        <Box sx={{ width: 32, height: 32, borderRadius: '8px', bgcolor: 'var(--color-primary-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <BalanceIcon sx={{ fontSize: 18, color: '#fff' }} />
                        </Box>
                        <Typography sx={{ color: 'var(--color-primary-dark)', fontWeight: 800, fontSize: '0.95rem' }}>
                            {t('Egypt Lawyers Network', 'شبكة المحامين المصريين')}
                        </Typography>
                    </Stack>
                    <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: 'var(--color-text)' }}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <List sx={{ px: 2, py: 2 }}>
                    {navLinks.map((link) => (
                        <ListItemButton
                            key={link.href}
                            onClick={() => scrollTo(link.href)}
                            sx={{
                                color: 'var(--color-text)', borderRadius: '12px', mb: 1,
                                '&:hover': {
                                    color: 'var(--color-primary)',
                                    bgcolor: 'var(--color-surface)',
                                },
                            }}
                        >
                            <ListItemText primary={t(link.en, link.ar)} primaryTypographyProps={{ fontWeight: 600 }} />
                        </ListItemButton>
                    ))}
                    <ListItemButton
                        component="a"
                        href="/admin"
                        sx={{
                            color: 'var(--color-primary)', borderRadius: '12px', mb: 1,
                            bgcolor: 'rgba(var(--color-primary-rgb), 0.05)',
                            '&:hover': {
                                bgcolor: 'rgba(var(--color-primary-rgb), 0.1)',
                            },
                        }}
                    >
                        <ListItemText primary={t('Admin Dashboard', 'لوحة التحكم')} primaryTypographyProps={{ fontWeight: 700 }} />
                    </ListItemButton>
                </List>
                {/* Mobile Join Now CTA */}
                <Box sx={{ p: 3, mt: 'auto' }}>
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={() => scrollTo('#download')}
                        startIcon={<DownloadIcon />}
                        sx={{
                            bgcolor: 'var(--color-primary)',
                            color: '#fff',
                            fontWeight: 700,
                            textTransform: 'none',
                            borderRadius: '12px',
                            py: 1.5,
                            '& .MuiButton-startIcon': { ml: 0.5 },
                            '&:hover': { bgcolor: 'var(--color-primary-dark)' },
                        }}
                    >
                        {t('Join Now — Free', 'انضم الآن — مجاناً')}
                    </Button>
                </Box>
            </Drawer>

            {/* Spacer for fixed AppBar */}
            <Toolbar sx={{ height: 76 }} />
        </>
    );
}
