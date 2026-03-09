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

import CitiesPage from './pages/admin/CitiesPage'
import CourtsPage from './pages/admin/CourtsPage'
import PostsPage from './pages/admin/HelpPostsPage'
import { LanguageProvider, useLang } from './contexts/LanguageContext'

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

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = lang
  }, [lang])

  const theme = useMemo(
    () =>
      createTheme({
        direction: lang === 'ar' ? 'rtl' : 'ltr',
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
      }),
    [lang]
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
              <Route path="pending-approvals" element={<PendingApprovalsPage />} />
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
      <MainApp />
    </LanguageProvider>
  )
}
