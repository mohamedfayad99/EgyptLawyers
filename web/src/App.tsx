import { useMemo, useEffect } from 'react'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { CacheProvider } from '@emotion/react'
import createCache from '@emotion/cache'
import rtlPlugin from 'stylis-plugin-rtl'
import { prefixer } from 'stylis'
import { getAdminToken } from './admin/auth'
import LandingPage from './pages/LandingPage'
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminLoginPage from './pages/admin/AdminLoginPage'
import UserManagementPage from './pages/admin/UserManagementPage'
import PendingApprovalsPage from './pages/admin/PendingApprovalsPage'
import LawyerDetailsPage from './pages/admin/LawyerDetailsPage'

import CitiesPage from './pages/admin/CitiesPage'
import CourtsPage from './pages/admin/CourtsPage'
import PostsPage from './pages/admin/HelpPostsPage'
import { LanguageProvider, useLang } from './contexts/LanguageContext'
import { AppThemeProvider, useAppTheme } from './contexts/ThemeContext'

const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
})

const cacheLtr = createCache({
  key: 'muiltr',
})

function RequireAdmin({ children }: { children: React.ReactNode }) {
  const token = getAdminToken()
  const { lang, toggleLang } = useLang()

  useEffect(() => {
    if (lang === 'ar') {
      toggleLang()
    }
  }, [lang, toggleLang])

  if (!token) return <Navigate to="/admin/login" replace />
  return <>{children}</>
}

function MainApp() {
  const { lang } = useLang()
  const { mode } = useAppTheme()

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = lang
  }, [lang])

  const theme = useMemo(
    () =>
      createTheme({
        direction: lang === 'ar' ? 'rtl' : 'ltr',
        palette: {
          mode: mode,
          primary: {
            main: mode === 'light' ? '#070930' : '#ffffff',
            dark: mode === 'light' ? '#050624' : '#f1f5f9',
          },
          secondary: {
            main: '#22c55e',
          },
          background: {
            default: mode === 'light' ? '#ffffff' : '#03031a',
            paper: mode === 'light' ? '#f8fafc' : '#070731',
          },
          text: {
            primary: mode === 'light' ? '#070930' : '#f8fafc',
            secondary: mode === 'light' ? '#64748b' : '#94a3b8',
          },
        },
        typography: {
          fontFamily: '"Inter", "Cairo", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        },
        shape: { borderRadius: 16 },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                fontWeight: 700,
                borderRadius: '12px',
              },
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                }
              }
            }
          },
          MuiPaper: {
            defaultProps: { elevation: 0 },
            styleOverrides: {
              root: {
                backgroundImage: 'none',
              }
            }
          },
        },
      }),
    [lang, mode]
  )

  return (
    <CacheProvider value={lang === 'ar' ? cacheRtl : cacheLtr}>
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
              <Route path="lawyers/:id" element={<LawyerDetailsPage />} />
              <Route path="pending-approvals" element={<PendingApprovalsPage />} />
              <Route path="pending-approvals/:id" element={<LawyerDetailsPage />} />
              <Route path="cities" element={<CitiesPage />} />
              <Route path="courts" element={<CourtsPage />} />
              <Route path="posts" element={<PostsPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </CacheProvider>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <AppThemeProvider>
        <MainApp />
      </AppThemeProvider>
    </LanguageProvider>
  )
}
