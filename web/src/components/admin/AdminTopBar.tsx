import { AppBar, Button, IconButton, Stack, Toolbar, Typography, useMediaQuery, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { clearAdminToken } from '../../admin/auth';

interface AdminTopBarProps {
    title?: string;
    onMenuClick: () => void;
}

export default function AdminTopBar({ title = 'Dashboard', onMenuClick }: AdminTopBarProps) {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    function logout() {
        clearAdminToken();
        navigate('/admin/login', { replace: true });
    }

    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                bgcolor: '#FFFFFF',
                borderBottom: '1px solid #E2E8F0',
            }}
        >
            <Toolbar sx={{ height: 64 }}>
                {isMobile && (
                    <IconButton onClick={onMenuClick} sx={{ mr: 1, color: '#0F172A' }}>
                        <MenuIcon />
                    </IconButton>
                )}

                <Typography variant="h6" sx={{ fontWeight: 700, color: '#0F172A', flex: 1 }}>
                    {title}
                </Typography>

                <Stack direction="row" alignItems="center" spacing={1}>
                    <Button
                        onClick={logout}
                        startIcon={<LogoutIcon />}
                        sx={{
                            color: '#64748B',
                            textTransform: 'none',
                            fontWeight: 500,
                            '&:hover': { bgcolor: '#F1F5F9', color: '#EF4444' },
                        }}
                    >
                        {!isMobile && 'Logout'}
                    </Button>
                </Stack>
            </Toolbar>
        </AppBar>
    );
}
