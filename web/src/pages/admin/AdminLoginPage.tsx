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
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        position: 'relative',
        bgcolor: 'background.default',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: '40%',
          height: '40%',
          bgcolor: 'rgba(34, 197, 94, 0.05)',
          filter: 'blur(120px)',
          borderRadius: '50%',
          zIndex: 0,
        }
      }}
    >
      <Button
        onClick={() => navigate('/')}
        startIcon={<ArrowBackIcon />}
        sx={{
          position: 'absolute',
          top: { xs: 24, md: 40 },
          left: { xs: 24, md: 40 },
          color: 'text.secondary',
          textTransform: 'none',
          fontWeight: 700,
          '&:hover': {
            color: 'primary.main',
            bgcolor: 'action.hover',
            transform: 'translateX(-4px)',
          }
        }}
      >
        Back to Website
      </Button>

      <Container maxWidth="xs" sx={{ position: 'relative', zIndex: 1 }}>
        <Box 
          sx={{ 
            p: { xs: 4, md: 6 }, 
            borderRadius: '24px', 
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 24px 48px -12px rgba(0,0,0,0.1)',
          }}
        >
          <Stack spacing={4}>
            <Box>
              <Typography variant="h4" fontWeight={900} sx={{ letterSpacing: '-0.02em', color: 'text.primary', mb: 1 }}>
                Admin Portal
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                Secure access for Egypt Lawyers Network administration.
              </Typography>
            </Box>

            {error && (
              <Alert 
                severity="error" 
                variant="outlined"
                sx={{ borderRadius: '12px', border: '1px solid rgba(211, 47, 47, 0.2)', bgcolor: 'rgba(211, 47, 47, 0.02)' }}
              >
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={onSubmit}>
              <Stack spacing={3}>
                <TextField
                  label="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  fullWidth
                  required
                />
                <TextField
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  fullWidth
                  required
                />
                <Button 
                  type="submit" 
                  variant="contained" 
                  size="large"
                  disabled={loading}
                  fullWidth
                  sx={{ 
                    py: 1.8, 
                    fontSize: '1rem',
                    boxShadow: '0 8px 20px -6px rgba(var(--color-primary-rgb), 0.3)',
                    '&:hover': {
                      boxShadow: '0 12px 24px -8px rgba(var(--color-primary-rgb), 0.4)',
                    }
                  }}
                >
                  {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
                </Button>
              </Stack>
            </Box>
          </Stack>
        </Box>
      </Container>
    </Box>
  )
}

