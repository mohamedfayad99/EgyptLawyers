import {
    Box, Drawer, IconButton, List, ListItemButton, ListItemIcon,
    ListItemText, Stack, Typography, useMediaQuery, useTheme,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import BalanceIcon from '@mui/icons-material/Balance';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { useLocation, useNavigate } from 'react-router-dom';

const DRAWER_WIDTH = 260;
const DRAWER_COLLAPSED = 72;

const navItems = [
    { label: 'Dashboard', icon: DashboardIcon, path: '/admin' },
    { label: 'User Management', icon: PeopleIcon, path: '/admin/users' },
    { label: 'Content Moderation', icon: AdminPanelSettingsIcon, path: '/admin/moderation' },
];

interface AdminSidebarProps {
    open: boolean;
    collapsed: boolean;
    onClose: () => void;
    onToggleCollapse: () => void;
}

export default function AdminSidebar({ open, collapsed, onClose, onToggleCollapse }: AdminSidebarProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path: string) => {
        if (path === '/admin') return location.pathname === '/admin';
        return location.pathname.startsWith(path);
    };

    const drawerWidth = collapsed && !isMobile ? DRAWER_COLLAPSED : DRAWER_WIDTH;

    const content = (
        <Box
            sx={{
                height: '100%',
                bgcolor: '#0F172A',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
            }}
        >
            {/* Logo area */}
            <Stack
                direction="row"
                alignItems="center"
                spacing={collapsed && !isMobile ? 0 : 1.5}
                sx={{
                    px: collapsed && !isMobile ? 1.5 : 2.5,
                    height: 64,
                    borderBottom: '1px solid rgba(212,175,55,0.1)',
                    justifyContent: collapsed && !isMobile ? 'center' : 'flex-start',
                }}
            >
                <Box
                    sx={{
                        width: 36, height: 36, borderRadius: '50%', bgcolor: '#D4AF37',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}
                >
                    <BalanceIcon sx={{ fontSize: 20, color: '#0F172A' }} />
                </Box>
                {(!collapsed || isMobile) && (
                    <Typography sx={{ color: '#D4AF37', fontWeight: 700, fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
                        Admin Panel
                    </Typography>
                )}
            </Stack>

            {/* Nav items */}
            <List sx={{ flex: 1, pt: 2, px: 1 }}>
                {navItems.map((item) => {
                    const active = isActive(item.path);
                    return (
                        <ListItemButton
                            key={item.path}
                            onClick={() => {
                                navigate(item.path);
                                if (isMobile) onClose();
                            }}
                            sx={{
                                borderRadius: 2,
                                mb: 0.5,
                                px: collapsed && !isMobile ? 1.5 : 2,
                                py: 1.2,
                                justifyContent: collapsed && !isMobile ? 'center' : 'flex-start',
                                bgcolor: active ? 'rgba(212,175,55,0.12)' : 'transparent',
                                '&:hover': { bgcolor: active ? 'rgba(212,175,55,0.16)' : 'rgba(255,255,255,0.04)' },
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: collapsed && !isMobile ? 0 : 40,
                                    color: active ? '#D4AF37' : 'rgba(255,255,255,0.45)',
                                    justifyContent: 'center',
                                }}
                            >
                                <item.icon sx={{ fontSize: 22 }} />
                            </ListItemIcon>
                            {(!collapsed || isMobile) && (
                                <ListItemText
                                    primary={item.label}
                                    primaryTypographyProps={{
                                        fontWeight: active ? 600 : 400,
                                        fontSize: '0.875rem',
                                        color: active ? '#F8FAFC' : 'rgba(255,255,255,0.6)',
                                    }}
                                />
                            )}
                        </ListItemButton>
                    );
                })}
            </List>

            {/* Collapse toggle (desktop only) */}
            {!isMobile && (
                <Box sx={{ p: 1.5, borderTop: '1px solid rgba(212,175,55,0.1)' }}>
                    <IconButton
                        onClick={onToggleCollapse}
                        sx={{
                            width: '100%',
                            color: 'rgba(255,255,255,0.4)',
                            borderRadius: 2,
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.04)' },
                        }}
                    >
                        <ChevronLeftIcon
                            sx={{
                                transition: 'transform 0.3s',
                                transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)',
                            }}
                        />
                    </IconButton>
                </Box>
            )}
        </Box>
    );

    // Mobile: temporary drawer
    if (isMobile) {
        return (
            <Drawer
                variant="temporary"
                open={open}
                onClose={onClose}
                PaperProps={{ sx: { width: DRAWER_WIDTH, border: 'none' } }}
                ModalProps={{ keepMounted: true }}
            >
                {content}
            </Drawer>
        );
    }

    // Desktop: persistent drawer
    return (
        <Drawer
            variant="permanent"
            open
            PaperProps={{
                sx: {
                    width: drawerWidth,
                    border: 'none',
                    transition: 'width 0.3s',
                    overflowX: 'hidden',
                },
            }}
        >
            {content}
        </Drawer>
    );
}

export { DRAWER_WIDTH, DRAWER_COLLAPSED };
