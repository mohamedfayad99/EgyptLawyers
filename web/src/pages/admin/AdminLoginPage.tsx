import { Alert, Box, Button, Container, Stack, TextField, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../api/client'
import { setAdminToken } from '../../admin/auth'
import { useLang } from '../../contexts/LanguageContext'

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const { lang, toggleLang } = useLang()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (lang === 'ar') {
      toggleLang()
    }
  }, [lang, toggleLang])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await api.post('/api/admin/login', { email: email.trim().toLowerCase(), password })
      setAdminToken(res.data.token)
      navigate('/admin', { replace: true })
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative' }}>
      <Button
        onClick={() => navigate('/')}
        startIcon={<ArrowBackIcon />}
        sx={{
          position: 'absolute',
          top: { xs: 16, md: 32 },
          left: { xs: 16, md: 32 },
          color: 'text.secondary',
          textTransform: 'none',
          fontWeight: 700,
          borderRadius: 2,
          transition: 'all 0.2s',
          '&:hover': {
            color: 'primary.main',
            transform: 'translateX(-4px)',
            bgcolor: 'rgba(79, 142, 247, 0.05)',
          }
        }}
      >
        Back to Website
      </Button>

      <Container maxWidth="sm">
        <Stack spacing={2.5}>
          <Typography variant="h4" fontWeight={800}>
            Admin login
          </Typography>
          <Typography color="text.secondary">
            Use the seeded admin from backend `appsettings.Development.json` (change it after first run).
          </Typography>

          {error && <Alert severity="error">{error}</Alert>}

          <Box component="form" onSubmit={onSubmit}>
            <Stack spacing={2}>
              <TextField
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                fullWidth
              />
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                fullWidth
              />
              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? 'Signing in…' : 'Sign in'}
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  )
}

