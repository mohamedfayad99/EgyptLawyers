import { useEffect, useState } from 'react';
import {
  Alert, Box, Grid, Paper, Stack, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Typography, Chip,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { api } from '../../api/client';
import StatCard from '../../components/admin/StatCard';

type Lawyer = {
  id: string;
  fullName: string;
  professionalTitle?: string | null;
  syndicateCardNumber: string;
  whatsappNumber: string;
  verificationStatus: 'Pending' | 'Approved' | 'Rejected' | number;
  isSuspended: boolean;
  createdAtUtc: string;
};

type City = { id: number; name: string };

export default function AdminDashboardPage() {
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [pendingLawyers, setPendingLawyers] = useState<Lawyer[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [allRes, pendingRes, citiesRes] = await Promise.all([
          api.get('/api/admin/lawyers'),
          api.get('/api/admin/lawyers', { params: { status: 'pending' } }),
          api.get('/api/cities'),
        ]);
        setLawyers(allRes.data);
        setPendingLawyers(pendingRes.data);
        setCities(citiesRes.data);
      } catch (e: any) {
        setError(e?.response?.data?.message ?? 'Failed to load dashboard data');
      }
    }
    load();
  }, []);

  const statusColor = (status: string | number) => {
    const s = String(status).toLowerCase();
    if (s === 'approved') return 'success';
    if (s === 'rejected') return 'error';
    return 'warning';
  };

  return (
    <Stack spacing={3}>
      {error && <Alert severity="error">{error}</Alert>}

      {/* Stats Cards */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Total Lawyers"
            value={lawyers.length}
            icon={PeopleIcon}
            color="#3B82F6"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Pending Approvals"
            value={pendingLawyers.length}
            icon={HourglassTopIcon}
            color="#F59E0B"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Cities"
            value={cities.length}
            icon={LocationCityIcon}
            color="#10B981"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Courts"
            value="—"
            icon={AccountBalanceIcon}
            color="#8B5CF6"
          />
        </Grid>
      </Grid>

      {/* Recent Registrations */}
      <Paper
        elevation={0}
        sx={{ borderRadius: 3, border: '1px solid #E2E8F0', overflow: 'hidden' }}
      >
        <Box sx={{ px: 3, py: 2.5, borderBottom: '1px solid #E2E8F0' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#0F172A' }}>
            Recent Registrations
          </Typography>
          <Typography sx={{ color: '#64748B', fontSize: '0.85rem', mt: 0.5 }}>
            Latest lawyer registration activity
          </Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>WhatsApp</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Syndicate #</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lawyers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: 'center', color: '#94A3B8', py: 4 }}>
                    No lawyers found. Data will appear when the backend is running.
                  </TableCell>
                </TableRow>
              ) : (
                lawyers.slice(0, 10).map((l) => (
                  <TableRow key={l.id} hover>
                    <TableCell>
                      <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>{l.fullName}</Typography>
                      {l.professionalTitle && (
                        <Typography sx={{ color: '#94A3B8', fontSize: '0.75rem' }}>{l.professionalTitle}</Typography>
                      )}
                    </TableCell>
                    <TableCell sx={{ color: '#64748B', fontSize: '0.875rem' }}>{l.whatsappNumber}</TableCell>
                    <TableCell sx={{ color: '#64748B', fontSize: '0.875rem' }}>{l.syndicateCardNumber}</TableCell>
                    <TableCell>
                      <Chip
                        label={String(l.verificationStatus)}
                        size="small"
                        color={statusColor(l.verificationStatus)}
                        variant="outlined"
                        sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: '#94A3B8', fontSize: '0.8rem' }}>
                      {new Date(l.createdAtUtc).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Stack>
  );
}
