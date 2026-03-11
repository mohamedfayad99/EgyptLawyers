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
                bgcolor: 'var(--color-background)',
                borderBottom: '1px solid var(--color-surface)',
            }}
        >
            <Toolbar sx={{ height: 64 }}>
                {isMobile && (
                    <IconButton onClick={onMenuClick} sx={{ mr: 1, ml: 0, color: 'var(--color-primary-dark)' }}>
                        <MenuIcon />
                    </IconButton>
                )}

                <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--color-text)', flex: 1 }}>
                    {title}
                </Typography>

                <Stack direction="row" alignItems="center" spacing={1}>
                    <Button
                        onClick={() => navigate('/')}
                        startIcon={<PublicIcon />}
                        sx={{
                            color: 'var(--color-primary)',
                            textTransform: 'none',
                            fontWeight: 600,
                            mr: 2,
                            px: 2,
                            borderRadius: '8px',
                            '&:hover': {
                                bgcolor: 'rgba(var(--color-primary-rgb), 0.08)',
                            },
                        }}
                    >
                        {!isMobile && t('View Website', 'انتقل للموقع')}
                    </Button>

                    <IconButton
                        onClick={toggleTheme}
                        sx={{
                            color: 'var(--color-primary-dark)',
                            bgcolor: 'var(--color-surface)',
                            borderRadius: '8px',
                            p: 1,
                            mr: 1,
                            '&:hover': { bgcolor: 'rgba(var(--color-primary-rgb), 0.1)' },
                        }}
                    >
                        {mode === 'dark' ? <LightModeIcon sx={{ fontSize: 20 }} /> : <DarkModeIcon sx={{ fontSize: 20 }} />}
                    </IconButton>

                    <Button
                        onClick={logout}
                        startIcon={<LogoutIcon />}
                        sx={{
                            color: 'rgba(var(--color-text-rgb),0.7)',
                            textTransform: 'none',
                            fontWeight: 500,
                            '&:hover': {
                                bgcolor: 'rgba(239, 68, 68, 0.08)',
                                color: '#ef4444',
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
