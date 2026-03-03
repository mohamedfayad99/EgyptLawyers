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
                    bgcolor: 'rgba(15, 23, 42, 0.95)',
                    backdropFilter: 'blur(12px)',
                    borderBottom: '1px solid rgba(212, 175, 55, 0.15)',
                }}
            >
                <Container maxWidth="lg">
                    <Toolbar disableGutters sx={{ height: 64 }}>
                        {/* Logo */}
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ flexGrow: { xs: 1, md: 0 } }}>
                            <Box
                                sx={{
                                    width: 36, height: 36, borderRadius: '50%',
                                    bgcolor: '#D4AF37', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}
                            >
                                <BalanceIcon sx={{ fontSize: 20, color: '#0F172A' }} />
                            </Box>
                            <Typography
                                sx={{
                                    fontWeight: 700, color: '#D4AF37', fontSize: '1.05rem',
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
                                            color: 'rgba(212, 175, 55, 0.7)',
                                            textTransform: 'none',
                                            fontWeight: 500,
                                            fontSize: '0.875rem',
                                            '&:hover': { color: '#D4AF37', bgcolor: 'rgba(212, 175, 55, 0.08)' },
                                        }}
                                    >
                                        {t(link.en, link.ar)}
                                    </Button>
                                ))}
                            </Stack>
                        )}

                        {/* Language toggle */}
                        <Button
                            onClick={toggleLang}
                            variant="outlined"
                            size="small"
                            sx={{
                                borderColor: 'rgba(212, 175, 55, 0.4)',
                                color: '#D4AF37',
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '0.75rem',
                                minWidth: 48,
                                '&:hover': { borderColor: '#D4AF37', bgcolor: 'rgba(212, 175, 55, 0.08)' },
                            }}
                        >
                            {lang === 'en' ? 'عربي' : 'EN'}
                        </Button>

                        {/* Mobile menu icon */}
                        {isMobile && (
                            <IconButton onClick={() => setDrawerOpen(true)} sx={{ ml: 1, color: '#D4AF37' }}>
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
                    sx: { width: 260, bgcolor: '#0F172A', borderLeft: '1px solid rgba(212, 175, 55, 0.15)' },
                }}
            >
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: '#D4AF37' }}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <List>
                    {navLinks.map((link) => (
                        <ListItemButton
                            key={link.href}
                            onClick={() => scrollTo(link.href)}
                            sx={{
                                color: 'rgba(212, 175, 55, 0.7)',
                                '&:hover': { color: '#D4AF37', bgcolor: 'rgba(212, 175, 55, 0.08)' },
                            }}
                        >
                            <ListItemText primary={t(link.en, link.ar)} />
                        </ListItemButton>
                    ))}
                </List>
            </Drawer>

            {/* Spacer for fixed AppBar */}
            <Toolbar />
        </>
    );
}
