import { useState } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar, { DRAWER_WIDTH, DRAWER_COLLAPSED } from '../../components/admin/AdminSidebar';
import AdminTopBar from '../../components/admin/AdminTopBar';
import ScrollToTop from '../../components/landing/ScrollToTop';
import { useLang } from '../../contexts/LanguageContext';

const pageTitleKeys: Record<string, 'dashboard' | 'lawyers' | 'pendingApprovals' | 'cities' | 'courts' | 'posts'> = {
  '/admin': 'dashboard',
  '/admin/lawyers': 'lawyers',
  '/admin/pending-approvals': 'pendingApprovals',
  '/admin/cities': 'cities',
  '/admin/courts': 'courts',
  '/admin/posts': 'posts',
};

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const { t } = useLang();

  const sidebarWidth = isMobile ? 0 : collapsed ? DRAWER_COLLAPSED : DRAWER_WIDTH;
  const titleKey = pageTitleKeys[location.pathname];
  const pageTitle = titleKey ? t(titleKey) : 'Admin';

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        bgcolor: 'var(--color-surface)',
        color: 'var(--color-text)',
        direction: 'ltr',
      }}
    >
      <AdminSidebar
        open={mobileOpen}
        collapsed={collapsed}
        onClose={() => setMobileOpen(false)}
        onToggleCollapse={() => setCollapsed((c) => !c)}
      />

      <Box
        component="main"
        sx={{
          flex: 1,
          ml: `${sidebarWidth}px`,
          mr: 0,
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <AdminTopBar
          title={pageTitle}
          onMenuClick={() => setMobileOpen(true)}
        />

        <Box sx={{ flex: 1, p: { xs: 2, sm: 3 } }}>
          <Outlet />
        </Box>
      </Box>

      <ScrollToTop />
    </Box>
  );
}
