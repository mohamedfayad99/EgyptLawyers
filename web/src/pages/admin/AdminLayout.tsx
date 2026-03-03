import { AppBar, Box, Button, Container, Stack, Toolbar, Typography } from '@mui/material'
import { Outlet, useNavigate } from 'react-router-dom'
import { clearAdminToken } from '../../admin/auth'

export default function AdminLayout() {
  const navigate = useNavigate()

  function logout() {
    clearAdminToken()
    navigate('/admin/login', { replace: true })
  }

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Container maxWidth="lg" disableGutters>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography fontWeight={800}>Egyptian Lawyers Network — Admin</Typography>
              <Button color="inherit" onClick={logout}>
                Logout
              </Button>
            </Stack>
          </Container>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  )
}

