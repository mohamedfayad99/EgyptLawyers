import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { getAdminToken } from './admin/auth'
import LandingPage from './pages/LandingPage'
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminLoginPage from './pages/admin/AdminLoginPage'
import UserManagementPage from './pages/admin/UserManagementPage'
import CitiesPage from './pages/admin/CitiesPage'
import CourtsPage from './pages/admin/CourtsPage'
import HelpPostsPage from './pages/admin/HelpPostsPage'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#4F8EF7' },
    secondary: { main: '#FF9B51' },
    background: { default: '#FFFFFF' },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600 },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
    },
  },
})

function RequireAdmin({ children }: { children: React.ReactNode }) {
  const token = getAdminToken()
  if (!token) return <Navigate to="/admin/login" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />

          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <AdminLayout />
              </RequireAdmin>
            }
          >
            <Route index element={<AdminDashboardPage />} />
            <Route path="lawyers" element={<UserManagementPage />} />
            <Route path="cities" element={<CitiesPage />} />
            <Route path="courts" element={<CourtsPage />} />
            <Route path="moderation" element={<HelpPostsPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
