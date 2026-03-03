import {
  Alert,
  Box,
  Button,
  Divider,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { api } from '../../api/client'

type Lawyer = {
  id: string
  fullName: string
  professionalTitle?: string | null
  syndicateCardNumber: string
  whatsappNumber: string
  verificationStatus: 'Pending' | 'Approved' | 'Rejected' | number
  isSuspended: boolean
  createdAtUtc: string
}

type City = { id: number; name: string }

export default function AdminDashboardPage() {
  const [statusFilter, setStatusFilter] = useState<'Pending' | 'Approved' | 'Rejected' | ''>('Pending')
  const [lawyers, setLawyers] = useState<Lawyer[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [newCityName, setNewCityName] = useState('')
  const [newCourtName, setNewCourtName] = useState('')
  const [newCourtCityId, setNewCourtCityId] = useState<number | ''>('')
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)

  const statusQuery = useMemo(() => statusFilter.toLowerCase(), [statusFilter])

  async function load() {
    setError(null)
    const [lawyersRes, citiesRes] = await Promise.all([
      api.get('/api/admin/lawyers', { params: statusFilter ? { status: statusQuery } : {} }),
      api.get('/api/cities'),
    ])
    setLawyers(lawyersRes.data)
    setCities(citiesRes.data)
  }

  useEffect(() => {
    load().catch((e) => setError(e?.response?.data?.message ?? 'Failed to load admin data'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusQuery])

  async function approve(id: string) {
    setInfo(null)
    await api.patch(`/api/admin/lawyers/${id}/approve`)
    setInfo('Approved.')
    await load()
  }

  async function reject(id: string) {
    setInfo(null)
    await api.patch(`/api/admin/lawyers/${id}/reject`)
    setInfo('Rejected.')
    await load()
  }

  async function toggleSuspend(id: string, suspended: boolean) {
    setInfo(null)
    await api.patch(`/api/admin/lawyers/${id}/suspend`, null, { params: { suspended } })
    setInfo(suspended ? 'Suspended.' : 'Unsuspended.')
    await load()
  }

  async function createCity() {
    setInfo(null)
    await api.post('/api/admin/cities', { name: newCityName })
    setNewCityName('')
    setInfo('City created.')
    await load()
  }

  async function createCourt() {
    setInfo(null)
    if (newCourtCityId === '') return
    await api.post('/api/admin/courts', { name: newCourtName, cityId: newCourtCityId })
    setNewCourtName('')
    setInfo('Court created.')
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h5" fontWeight={800}>
        Dashboard
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}
      {info && <Alert severity="success">{info}</Alert>}

      <Paper variant="outlined" sx={{ p: 2 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
          <Typography fontWeight={700}>Lawyer registrations</Typography>
          <Box sx={{ flex: 1 }} />
          <TextField
            select
            size="small"
            label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Approved">Approved</MenuItem>
            <MenuItem value="Rejected">Rejected</MenuItem>
          </TextField>
        </Stack>
        <Divider sx={{ my: 2 }} />

        <Stack spacing={1.5}>
          {lawyers.length === 0 ? (
            <Typography color="text.secondary">No lawyers in this filter.</Typography>
          ) : (
            lawyers.map((l) => (
              <Paper key={l.id} variant="outlined" sx={{ p: 2 }}>
                <Stack spacing={1}>
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                    justifyContent="space-between"
                    spacing={1}
                  >
                    <Box>
                      <Typography fontWeight={800}>{l.fullName}</Typography>
                      <Typography color="text.secondary" variant="body2">
                        WhatsApp: {l.whatsappNumber} • Syndicate: {l.syndicateCardNumber}
                      </Typography>
                    </Box>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      <Button size="small" variant="outlined" onClick={() => toggleSuspend(l.id, !l.isSuspended)}>
                        {l.isSuspended ? 'Unsuspend' : 'Suspend'}
                      </Button>
                      <Button size="small" variant="contained" onClick={() => approve(l.id)}>
                        Approve
                      </Button>
                      <Button size="small" color="error" variant="outlined" onClick={() => reject(l.id)}>
                        Reject
                      </Button>
                    </Stack>
                  </Stack>
                </Stack>
              </Paper>
            ))
          )}
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={{ p: 2 }}>
        <Typography fontWeight={700} gutterBottom>
          Courts & cities
        </Typography>
        <Stack spacing={2}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <TextField
              label="New city name"
              value={newCityName}
              onChange={(e) => setNewCityName(e.target.value)}
              fullWidth
            />
            <Button variant="contained" onClick={createCity} disabled={!newCityName.trim()}>
              Add city
            </Button>
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <TextField
              label="New court name"
              value={newCourtName}
              onChange={(e) => setNewCourtName(e.target.value)}
              fullWidth
            />
            <TextField
              select
              label="City"
              value={newCourtCityId}
              onChange={(e) => setNewCourtCityId(Number(e.target.value))}
              sx={{ minWidth: 220 }}
            >
              {cities.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name}
                </MenuItem>
              ))}
            </TextField>
            <Button
              variant="contained"
              onClick={createCourt}
              disabled={!newCourtName.trim() || newCourtCityId === ''}
            >
              Add court
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  )
}

