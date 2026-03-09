import { AppBar, Button, IconButton, Stack, Toolbar, Typography, useMediaQuery, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { clearAdminToken } from '../../admin/auth';
import { useLang } from '../../contexts/LanguageContext';

interface AdminTopBarProps {
    title?: string;
    onMenuClick: () => void;
}

export default function AdminTopBar({ title = 'Dashboard', onMenuClick }: AdminTopBarProps) {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { t } = useLang();

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
                        onClick={logout}
                        startIcon={<LogoutIcon />}
                        sx={{
                            color: 'rgba(var(--color-text-rgb),0.7)',
                            textTransform: 'none',
                            fontWeight: 500,
                            '&:hover': {
                                bgcolor: 'var(--color-surface)',
                                color: 'var(--color-accent)',
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
