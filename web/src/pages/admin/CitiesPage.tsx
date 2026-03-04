import { useEffect, useState } from 'react';
import {
    Alert, Box, Button, Collapse, Stack, TextField, Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import AdminTable, { type Column } from '../../components/admin/AdminTable';
import { getCities, createCity, type City } from '../../admin/services/cityService';

const columns: Column<City & Record<string, unknown>>[] = [
    {
        header: 'ID',
        accessor: 'id' as keyof (City & Record<string, unknown>),
        width: 80,
        render: (row) => (
            <Typography sx={{ color: 'rgba(var(--color-text-rgb),0.6)', fontSize: '0.875rem' }}>
                #{row.id}
            </Typography>
        ),
    },
    {
        header: 'City Name',
        accessor: 'name' as keyof (City & Record<string, unknown>),
        render: (row) => (
            <Stack direction="row" alignItems="center" spacing={1}>
                <LocationCityIcon sx={{ fontSize: 18, color: 'rgba(var(--color-text-rgb),0.5)' }} />
                <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>{row.name}</Typography>
            </Stack>
        ),
    },
];

export default function CitiesPage() {
    const [cities, setCities] = useState<(City & Record<string, unknown>)[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [info, setInfo] = useState<string | null>(null);

    const [showForm, setShowForm] = useState(false);
    const [newName, setNewName] = useState('');
    const [creating, setCreating] = useState(false);

    async function load() {
        setLoading(true);
        setError(null);
        try {
            const data = await getCities();
            setCities(data as (City & Record<string, unknown>)[]);
        } catch (e: unknown) {
            const err = e as { response?: { data?: { message?: string } } };
            setError(err?.response?.data?.message ?? 'Failed to load cities');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { load(); }, []);

    async function handleCreate() {
        if (!newName.trim()) return;
        setCreating(true);
        setError(null);
        setInfo(null);
        try {
            await createCity(newName.trim());
            setNewName('');
            setShowForm(false);
            setInfo('City created successfully.');
            await load();
        } catch (e: unknown) {
            const err = e as { response?: { data?: { message?: string } } };
            setError(err?.response?.data?.message ?? 'Failed to create city');
        } finally {
            setCreating(false);
        }
    }

    return (
        <Stack spacing={2}>
            {info && <Alert severity="success" onClose={() => setInfo(null)}>{info}</Alert>}

            <AdminTable
                columns={columns}
                data={cities}
                loading={loading}
                error={error}
                onClearError={() => setError(null)}
                searchPlaceholder="Search cities…"
                emptyMessage="No cities found. Create one to get started."
                getRowKey={(row) => row.id}
                toolbar={
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
                        Add City
                    </Button>
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
                            label="City name"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            size="small"
                            sx={{ flex: 1 }}
                            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                        />
                        <Button
                            variant="contained"
                            onClick={handleCreate}
                            disabled={!newName.trim() || creating}
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
