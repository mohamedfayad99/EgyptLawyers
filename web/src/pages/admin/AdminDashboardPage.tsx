import { useEffect, useState, useMemo } from 'react';
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
import { useLang } from '../../contexts/LanguageContext';

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
  const [cities, setCities] = useState<City[]>([]);
  const [courts, setCourts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { t } = useLang();

  useEffect(() => {
    async function load() {
      try {
        const [allRes, citiesRes, courtsRes] = await Promise.all([
          api.get('/api/admin/lawyers'),
          api.get('/api/cities'),
          api.get('/api/courts'),
        ]);
        setLawyers((allRes.data as Lawyer[]).filter(l => l.id !== 'string'));
        setCities(citiesRes.data);
        setCourts(courtsRes.data);
      } catch (e: any) {
        setError(e?.response?.data?.message ?? t('failedToLoadDashboard'));
      }
    }
    load();
  }, []);

  const statusLabel = (status: string | number): string => {
    if (status === 0 || String(status).toLowerCase() === 'pending') return 'Pending';
    if (status === 1 || String(status).toLowerCase() === 'approved') return 'Approved';
    if (status === 2 || String(status).toLowerCase() === 'rejected') return 'Rejected';
    return String(status);
  };

  const statusColor = (status: string | number) => {
    const label = statusLabel(status).toLowerCase();
    if (label === 'approved') return 'success';
    if (label === 'rejected') return 'error';
    return 'warning'; // Pending
  };

  const approvedLawyers = useMemo(() => lawyers.filter(l => statusLabel(l.verificationStatus) === 'Approved'), [lawyers]);
  const pendingLawyers = useMemo(() => lawyers.filter(l => statusLabel(l.verificationStatus) === 'Pending'), [lawyers]);

  const latestPendingRegistrations = useMemo(() => {
    return pendingLawyers
      .slice()
      .sort((a, b) => new Date(b.createdAtUtc).getTime() - new Date(a.createdAtUtc).getTime())
      .slice(0, 5);
  }, [pendingLawyers]);

  return (
    <Stack spacing={3}>
      {error && <Alert severity="error">{error}</Alert>}

      {/* Stats Cards */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title={t('totalLawyers')}
            value={approvedLawyers.length}
            icon={PeopleIcon}
            color="var(--color-primary)"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title={t('pendingApprovalsCard')}
            value={pendingLawyers.length}
            icon={HourglassTopIcon}
            color="var(--color-accent)"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title={t('citiesCard')}
            value={cities.length}
            icon={LocationCityIcon}
            color="var(--color-primary)"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title={t('courtsCard')}
            value={courts.length}
            icon={AccountBalanceIcon}
            color="var(--color-primary)"
          />
        </Grid>
      </Grid>

      {/* Recent Registrations */}
      <Paper
        elevation={0}
        sx={{ borderRadius: 3, border: '1px solid rgba(var(--color-text-rgb),0.06)', overflow: 'hidden', bgcolor: 'var(--color-background)' }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          alignItems={{ sm: 'center' }}
          justifyContent="space-between"
          sx={{ px: 3, py: 2.5, borderBottom: '1px solid var(--color-surface)' }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--color-text)' }}>
              {t('recentRegistrations')}
            </Typography>
            <Typography sx={{ color: 'rgba(var(--color-text-rgb),0.7)', fontSize: '0.85rem', mt: 0.5 }}>
              {t('latestActivity')}
            </Typography>
          </Box>
        </Stack>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'var(--color-surface)' }}>
                <TableCell sx={{ fontWeight: 600, color: 'var(--color-text)' }}>{t('name')}</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'var(--color-text)' }}>{t('whatsapp')}</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'var(--color-text)' }}>{t('syndicateNo')}</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'var(--color-text)' }}>{t('status')}</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'var(--color-text)' }}>{t('date')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {latestPendingRegistrations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: 'center', color: 'rgba(var(--color-text-rgb),0.5)', py: 4 }}>
                    {t('noNewRegistrations')}
                  </TableCell>
                </TableRow>
              ) : (
                latestPendingRegistrations.map((l) => (
                  <TableRow key={l.id} hover>
                    <TableCell>
                      <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>{l.fullName}</Typography>
                      {l.professionalTitle && (
                        <Typography sx={{ color: 'rgba(var(--color-text-rgb),0.6)', fontSize: '0.75rem' }}>{l.professionalTitle}</Typography>
                      )}
                    </TableCell>
                    <TableCell sx={{ color: 'rgba(var(--color-text-rgb),0.8)', fontSize: '0.875rem' }}>{l.whatsappNumber}</TableCell>
                    <TableCell sx={{ color: 'rgba(var(--color-text-rgb),0.8)', fontSize: '0.875rem' }}>{l.syndicateCardNumber}</TableCell>
                    <TableCell>
                      <Chip
                        label={t(statusLabel(l.verificationStatus).toLowerCase() as any) ?? statusLabel(l.verificationStatus)}
                        size="small"
                        color={statusColor(l.verificationStatus)}
                        variant="outlined"
                        sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: 'rgba(var(--color-text-rgb),0.6)', fontSize: '0.8rem' }}>
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
