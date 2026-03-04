import { useEffect, useState } from 'react';
import {
    Alert, Box, Button, Collapse, MenuItem, Stack,
    TextField, Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AdminTable, { type Column } from '../../components/admin/AdminTable';
import { getCourts, createCourt, type Court } from '../../admin/services/courtService';
import { getCities, type City } from '../../admin/services/cityService';

type CourtRow = Court & { cityName?: string } & Record<string, unknown>;

export default function CourtsPage() {
    const [courts, setCourts] = useState<CourtRow[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [info, setInfo] = useState<string | null>(null);

    const [filterCityId, setFilterCityId] = useState<number | ''>('');

    const [showForm, setShowForm] = useState(false);
    const [newName, setNewName] = useState('');
    const [newCityId, setNewCityId] = useState<number | ''>('');
    const [creating, setCreating] = useState(false);

    async function loadCities() {
        try {
            const data = await getCities();
            setCities(data);
        } catch { /* ignore — cities filter will be empty */ }
    }

    async function loadCourts() {
        setLoading(true);
        setError(null);
        try {
            const cityParam = filterCityId === '' ? undefined : filterCityId;
            const data = await getCourts(cityParam);
            // enrich with city name
            const cityMap = new Map(cities.map((c) => [c.id, c.name]));
            setCourts(
                (data as CourtRow[]).map((c) => ({ ...c, cityName: cityMap.get(c.cityId) ?? `City #${c.cityId}` })),
            );
        } catch (e: unknown) {
            const err = e as { response?: { data?: { message?: string } } };
            setError(err?.response?.data?.message ?? 'Failed to load courts');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { loadCities(); }, []);
    useEffect(() => { if (cities.length >= 0) loadCourts(); }, [filterCityId, cities]);

    const columns: Column<CourtRow>[] = [
        {
            header: 'ID',
            accessor: 'id' as keyof CourtRow,
            width: 80,
            render: (row) => (
                <Typography sx={{ color: 'rgba(var(--color-text-rgb),0.6)', fontSize: '0.875rem' }}>
                    #{row.id}
                </Typography>
            ),
        },
        {
            header: 'Court Name',
            accessor: 'name' as keyof CourtRow,
            render: (row) => (
                <Stack direction="row" alignItems="center" spacing={1}>
                    <AccountBalanceIcon sx={{ fontSize: 18, color: 'rgba(var(--color-text-rgb),0.5)' }} />
                    <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>{row.name}</Typography>
                </Stack>
            ),
        },
        {
            header: 'City',
            accessor: 'cityName' as keyof CourtRow,
            render: (row) => (
                <Typography sx={{ fontSize: '0.875rem' }}>{row.cityName}</Typography>
            ),
        },
    ];

    async function handleCreate() {
        if (!newName.trim() || newCityId === '') return;
        setCreating(true);
        setError(null);
        setInfo(null);
        try {
            await createCourt(newName.trim(), newCityId);
            setNewName('');
            setNewCityId('');
            setShowForm(false);
            setInfo('Court created successfully.');
            await loadCourts();
        } catch (e: unknown) {
            const err = e as { response?: { data?: { message?: string } } };
            setError(err?.response?.data?.message ?? 'Failed to create court');
        } finally {
            setCreating(false);
        }
    }

    return (
        <Stack spacing={2}>
            {info && <Alert severity="success" onClose={() => setInfo(null)}>{info}</Alert>}

            <AdminTable
                columns={columns}
                data={courts}
                loading={loading}
                error={error}
                onClearError={() => setError(null)}
                searchPlaceholder="Search courts…"
                emptyMessage="No courts found. Create one to get started."
                getRowKey={(row) => row.id}
                toolbar={
                    <Stack direction="row" spacing={2} alignItems="center">
                        <TextField
                            select
                            size="small"
                            label="Filter by City"
                            value={filterCityId}
                            onChange={(e) => setFilterCityId(e.target.value === '' ? '' : Number(e.target.value))}
                            sx={{ minWidth: 160 }}
                        >
                            <MenuItem value="">All Cities</MenuItem>
                            {cities.map((c) => (
                                <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                            ))}
                        </TextField>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => setShowForm((v) => !v)}
                            sx={{
                                bgcolor: 'var(--color-primary)',
                                textTransform: 'none',
                                fontWeight: 600,
                                '&:hover': { bgcolor: '#346fda' },
                            }}
                        >
                            Add Court
                        </Button>
                    </Stack>
                }
            />

            <Collapse in={showForm}>
                <Box
                    sx={{
                        p: 3,
                        borderRadius: 3,
                        border: '1px solid rgba(var(--color-text-rgb),0.06)',
                        bgcolor: 'var(--color-background)',
                    }}
                >
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
                        <TextField
                            label="Court name"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            size="small"
                            sx={{ flex: 1 }}
                        />
                        <TextField
                            select
                            label="City"
                            value={newCityId}
                            onChange={(e) => setNewCityId(Number(e.target.value))}
                            size="small"
                            sx={{ minWidth: 160 }}
                        >
                            {cities.length === 0 ? (
                                <MenuItem value="" disabled>No cities available</MenuItem>
                            ) : (
                                cities.map((c) => (
                                    <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                                ))
                            )}
                        </TextField>
                        <Button
                            variant="contained"
                            onClick={handleCreate}
                            disabled={!newName.trim() || newCityId === '' || creating}
                            sx={{
                                bgcolor: 'var(--color-primary)',
                                textTransform: 'none',
                                fontWeight: 600,
                                '&:hover': { bgcolor: '#346fda' },
                            }}
                        >
                            {creating ? 'Creating…' : 'Create'}
                        </Button>
                    </Stack>
                </Box>
            </Collapse>
        </Stack>
    );
}
