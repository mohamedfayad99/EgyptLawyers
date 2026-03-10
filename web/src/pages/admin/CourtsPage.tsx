import { useEffect, useState } from 'react';
import {
    Alert, Box, Button, Collapse, MenuItem, Stack,
    TextField, Typography, IconButton, Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import AdminTable, { type Column } from '../../components/admin/AdminTable';
import { getCourts, createCourt, updateCourt, deleteCourt, type Court } from '../../admin/services/courtService';
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

    const [editingId, setEditingId] = useState<number | null>(null);
    const [editName, setEditName] = useState('');
    const [editCityId, setEditCityId] = useState<number | ''>('');
    const [saving, setSaving] = useState(false);

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

    async function handleUpdate(id: number) {
        if (!editName.trim() || editCityId === '') return;
        setSaving(true);
        setError(null);
        try {
            await updateCourt(id, editName.trim(), Number(editCityId));
            setEditingId(null);
            setInfo('Court updated successfully.');
            await loadCourts();
        } catch (e: unknown) {
            const err = e as { response?: { data?: { message?: string } } };
            setError(err?.response?.data?.message ?? 'Failed to update court');
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(id: number) {
        if (!window.confirm('Are you sure you want to delete this court? This will also remove all posts associated with it.')) return;
        setError(null);
        setInfo(null);
        try {
            await deleteCourt(id);
            setInfo('Court deleted successfully.');
            await loadCourts();
        } catch (e: unknown) {
            const err = e as { response?: { data?: { message?: string } } };
            setError(err?.response?.data?.message ?? 'Failed to delete court');
        }
    }

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
                editingId === row.id ? (
                    <TextField
                        size="small"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        autoFocus
                        onKeyDown={(e) => e.key === 'Enter' && handleUpdate(row.id)}
                        sx={{ minWidth: 200 }}
                    />
                ) : (
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <AccountBalanceIcon sx={{ fontSize: 18, color: 'rgba(var(--color-text-rgb),0.5)' }} />
                        <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>{row.name}</Typography>
                    </Stack>
                )
            ),
        },
        {
            header: 'City',
            accessor: 'cityName' as keyof CourtRow,
            render: (row) => (
                editingId === row.id ? (
                    <TextField
                        select
                        size="small"
                        value={editCityId}
                        onChange={(e) => setEditCityId(Number(e.target.value))}
                        sx={{ minWidth: 160 }}
                    >
                        {cities.map((c) => (
                            <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                        ))}
                    </TextField>
                ) : (
                    <Typography sx={{ fontSize: '0.875rem' }}>{row.cityName}</Typography>
                )
            ),
        },
        {
            header: 'Actions',
            accessor: 'id' as keyof CourtRow,
            width: 120,
            render: (row) => (
                <Stack direction="row" spacing={1}>
                    {editingId === row.id ? (
                        <>
                            <Tooltip title="Save">
                                <IconButton size="small" color="primary" onClick={() => handleUpdate(row.id)} disabled={saving}>
                                    <CheckIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Cancel">
                                <IconButton size="small" onClick={() => setEditingId(null)}>
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </>
                    ) : (
                        <>
                            <Tooltip title="Edit">
                                <IconButton size="small" onClick={() => { setEditingId(row.id); setEditName(row.name); setEditCityId(row.cityId); }}>
                                    <EditIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                                <IconButton size="small" color="error" onClick={() => handleDelete(row.id)}>
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </>
                    )}
                </Stack>
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
