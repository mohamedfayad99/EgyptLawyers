import { useEffect, useState, useMemo } from 'react';
import {
  Alert, Grid, Stack,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { api } from '../../api/client';
import StatCard from '../../components/admin/StatCard';
import StatisticsSection from '../../components/admin/StatisticsSection';
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



  const approvedLawyers = useMemo(() => lawyers.filter(l => statusLabel(l.verificationStatus) === 'Approved'), [lawyers]);
  const pendingLawyers = useMemo(() => lawyers.filter(l => statusLabel(l.verificationStatus) === 'Pending'), [lawyers]);

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
      
      <StatisticsSection />
    </Stack>
  );
}
