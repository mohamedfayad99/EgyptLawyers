import { useState } from 'react';
import {
    AppBar, Toolbar, Box, Button, IconButton, Drawer, List, ListItemButton,
    ListItemText, Typography, Container, Stack, useMediaQuery, useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import BalanceIcon from '@mui/icons-material/Balance';
import { useLang } from '../../contexts/LanguageContext';

const navLinks = [
    { en: 'Home', ar: 'الرئيسية', href: '#home' },
    { en: 'How It Works', ar: 'كيف يعمل', href: '#how-it-works' },
    { en: 'Features', ar: 'المميزات', href: '#features' },
    { en: 'Why Join', ar: 'لماذا تنضم', href: '#why-join' },
    { en: 'Download', ar: 'تحميل', href: '#download' },
];

export default function Navbar() {
    const { t, toggleLang, lang } = useLang();
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
                    bgcolor: 'rgba(var(--color-primary-dark-rgb), 0.97)',
                    backdropFilter: 'blur(12px)',
                    borderBottom: '1px solid rgba(var(--color-surface-rgb), 0.8)',
                }}
            >
                <Container maxWidth="lg">
                    <Toolbar disableGutters sx={{ height: 64 }}>
                        {/* Logo */}
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ flexGrow: { xs: 1, md: 0 }, gap: "8px" }}>
                            <Box
                                sx={{
                                    width: 36, height: 36, borderRadius: '50%',
                                    bgcolor: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}
                            >
                                <BalanceIcon sx={{ fontSize: 20, color: 'var(--color-background)' }} />
                            </Box>
                            <Typography
                                sx={{
                                    fontWeight: 700, color: 'var(--color-background)', fontSize: '1.05rem',
                                    display: { xs: 'none', sm: 'block' },
                                    fontFamily: '"Inter", sans-serif',
                                }}
                            >
                                {t('Egyptian Lawyers Network', 'شبكة المحامين المصريين')}
                            </Typography>
                        </Stack>

                        {/* Desktop Links */}
                        {!isMobile && (
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ ml: 'auto', mr: 2 }}>
                                {navLinks.map((link) => (
                                    <Button
                                        key={link.href}
                                        onClick={() => scrollTo(link.href)}
                                        sx={{
                                            color: 'rgba(255, 255, 255, 0.75)',
                                            textTransform: 'none',
                                            fontWeight: 500,
                                            fontSize: '0.875rem',
                                            '&:hover': {
                                                color: 'var(--color-accent)',
                                                bgcolor: 'rgba(var(--color-accent-rgb), 0.12)',
                                            },
                                        }}
                                    >
                                        {t(link.en, link.ar)}
                                    </Button>
                                ))}
                                <Button
                                    href="/admin/login"
                                    sx={{
                                        color: 'rgba(255, 255, 255, 0.75)',
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        fontSize: '0.875rem',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        borderRadius: 2,
                                        px: 2,
                                        ml: 1,
                                        '&:hover': {
                                            borderColor: 'rgba(255,255,255,0.4)',
                                            bgcolor: 'rgba(255,255,255,0.05)',
                                        },
                                    }}
                                >
                                    {t('Admin', 'الادارة')}
                                </Button>
                            </Stack>
                        )}

                        {/* Language toggle */}
                        <Button
                            onClick={toggleLang}
                            variant="outlined"
                            size="small"
                            sx={{
                                borderColor: 'rgba(255, 255, 255, 0.35)',
                                color: 'var(--color-background)',
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '0.75rem',
                                minWidth: 48,
                                '&:hover': {
                                    borderColor: 'var(--color-accent)',
                                    bgcolor: 'rgba(var(--color-accent-rgb), 0.12)',
                                },
                            }}
                        >
                            {lang === 'en' ? 'عربي' : 'EN'}
                        </Button>

                        {/* Mobile menu icon */}
                        {isMobile && (
                            <IconButton onClick={() => setDrawerOpen(true)} sx={{ ml: 1, color: 'var(--color-background)' }}>
                                <MenuIcon />
                            </IconButton>
                        )}
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
                        width: 260,
                        bgcolor: 'var(--color-primary-dark)',
                        borderLeft: '1px solid rgba(var(--color-surface-rgb), 0.8)',
                    },
                }}
            >
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: 'var(--color-background)' }}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <List>
                    {navLinks.map((link) => (
                        <ListItemButton
                            key={link.href}
                            onClick={() => scrollTo(link.href)}
                            sx={{
                                color: 'rgba(255, 255, 255, 0.8)',
                                '&:hover': {
                                    color: 'var(--color-accent)',
                                    bgcolor: 'rgba(var(--color-accent-rgb), 0.12)',
                                },
                            }}
                        >
                            <ListItemText primary={t(link.en, link.ar)} />
                        </ListItemButton>
                    ))}
                    <ListItemButton
                        component="a"
                        href="/admin/login"
                        sx={{
                            color: 'var(--color-accent)',
                            fontWeight: 600,
                            mt: 1,
                            '&:hover': {
                                bgcolor: 'rgba(var(--color-accent-rgb), 0.12)',
                            },
                        }}
                    >
                        <ListItemText primary={t('Admin Login', 'تسجيل دخول الإدارة')} />
                    </ListItemButton>
                </List>
            </Drawer>

            {/* Spacer for fixed AppBar */}
            <Toolbar />
        </>
    );
}
