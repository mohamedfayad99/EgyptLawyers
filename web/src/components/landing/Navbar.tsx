import { useState } from 'react';
import {
    AppBar, Toolbar, Box, Button, IconButton, Drawer, List, ListItemButton,
    ListItemText, Typography, Container, Stack, useMediaQuery, useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import BalanceIcon from '@mui/icons-material/Balance';
import { Link as RouterLink } from 'react-router-dom';
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
                            <Stack direction="row" spacing={1} sx={{ ml: 'auto', mr: 2 }}>
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
                            </Stack>
                        )}

                        <Stack direction="row" spacing={1} sx={{ ml: 2 }}>
                            {/* Admin login (desktop) */}
                            {!isMobile && (
                                <Button
                                    component={RouterLink}
                                    to="/admin/login"
                                    variant="text"
                                    size="small"
                                    sx={{
                                        color: 'rgba(255, 255, 255, 0.8)',
                                        textTransform: 'none',
                                        fontWeight: 500,
                                        fontSize: '0.8rem',
                                        '&:hover': {
                                            color: 'var(--color-accent)',
                                            bgcolor: 'rgba(var(--color-accent-rgb), 0.12)',
                                        },
                                    }}
                                >
                                    {t('Admin login', 'تسجيل دخول المشرف')}
                                </Button>
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
                        </Stack>

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
                    {/* Admin login (mobile) */}
                    <ListItemButton
                        component={RouterLink}
                        to="/admin/login"
                        onClick={() => setDrawerOpen(false)}
                        sx={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            '&:hover': {
                                color: 'var(--color-accent)',
                                bgcolor: 'rgba(var(--color-accent-rgb), 0.12)',
                            },
                        }}
                    >
                        <ListItemText primary={t('Admin login', 'تسجيل دخول المشرف')} />
                    </ListItemButton>
                </List>
            </Drawer>

            {/* Spacer for fixed AppBar */}
            <Toolbar />
        </>
    );
}
