import { useState } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar, { DRAWER_WIDTH, DRAWER_COLLAPSED } from '../../components/admin/AdminSidebar';
import AdminTopBar from '../../components/admin/AdminTopBar';

const pageTitles: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/lawyers': 'Lawyers',
  '/admin/cities': 'Cities',
  '/admin/courts': 'Courts',
  '/admin/moderation': 'Moderation',
};

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();

  const sidebarWidth = isMobile ? 0 : collapsed ? DRAWER_COLLAPSED : DRAWER_WIDTH;
  const pageTitle = pageTitles[location.pathname] ?? 'Admin';

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'var(--color-surface)' }}>
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
          transition: 'margin-left 0.3s',
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
    </Box>
  );
}
