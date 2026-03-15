import { AppBar, Button, IconButton, Stack, Toolbar, Typography, useMediaQuery, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import PublicIcon from '@mui/icons-material/Public';
import { useNavigate } from 'react-router-dom';
import { clearAdminToken } from '../../admin/auth';
import { useLang } from '../../contexts/LanguageContext';
import { useAppTheme } from '../../contexts/ThemeContext';

interface AdminTopBarProps {
    title?: string;
    onMenuClick: () => void;
}

export default function AdminTopBar({ title = 'Dashboard', onMenuClick }: AdminTopBarProps) {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { t } = useLang();
    const { mode, toggleTheme } = useAppTheme();

    function logout() {
        clearAdminToken();
        navigate('/admin/login', { replace: true });
    }

    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                bgcolor: 'var(--color-sidebar-bg)', // Using the same dark color as sidebar
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                color: '#fff',
            }}
        >
            <Toolbar sx={{ height: 64 }}>
                {isMobile && (
                    <IconButton onClick={onMenuClick} sx={{ mr: 1, ml: 0, color: '#fff' }}>
                        <MenuIcon />
                    </IconButton>
                )}

                <Typography variant="h6" sx={{ fontWeight: 700, color: '#fff', flex: 1, letterSpacing: '0.5px' }}>
                    {title}
                </Typography>

                <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Button
                        onClick={() => navigate('/')}
                        sx={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            textTransform: 'none',
                            fontWeight: 600,
                            mr: 1,
                            px: 2,
                            borderRadius: '10px',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            '&:hover': {
                                bgcolor: 'rgba(255, 255, 255, 0.05)',
                                color: '#fff',
                                borderColor: 'rgba(255, 255, 255, 0.2)',
                            },
                        }}
                    >
                        {t('View Website', 'انتقل للموقع')}
                    </Button>

                    <IconButton
                        onClick={toggleTheme}
                        sx={{
                            color: mode === 'dark' ? 'var(--color-accent)' : '#fff',
                            bgcolor: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '10px',
                            p: 1,
                            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' },
                        }}
                    >
                        {mode === 'dark' ? <LightModeIcon sx={{ fontSize: 20 }} /> : <DarkModeIcon sx={{ fontSize: 20 }} />}
                    </IconButton>

                    <Button
                        onClick={logout}
                        startIcon={<LogoutIcon />}
                        sx={{
                            color: 'rgba(255, 255, 255, 0.5)',
                            textTransform: 'none',
                            fontWeight: 500,
                            borderRadius: '10px',
                            '&:hover': {
                                bgcolor: 'rgba(239, 68, 68, 0.1)',
                                color: '#f87171', // Reddish for logout
                            },
                        }}
                    >
                        {!isMobile && t('logout')}
                    </Button>
                </Stack>
            </Toolbar>
        </AppBar>
    );
}
