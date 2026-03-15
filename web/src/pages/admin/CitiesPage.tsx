import { useEffect, useState } from 'react';
import {
    Alert, Box, Button, Collapse, Stack, TextField, Typography, IconButton, Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import AdminTable, { type Column } from '../../components/admin/AdminTable';
import { getDetailedCities, createCity, updateCity, deleteCity, type CityDetailed } from '../../admin/services/cityService';
import PeopleIcon from '@mui/icons-material/People';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { Chip } from '@mui/material';

export default function CitiesPage() {
    const [cities, setCities] = useState<CityDetailed[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [info, setInfo] = useState<string | null>(null);

    const [showForm, setShowForm] = useState(false);
    const [newName, setNewName] = useState('');
    const [creating, setCreating] = useState(false);

    const [editingId, setEditingId] = useState<number | null>(null);
    const [editName, setEditName] = useState('');
    const [saving, setSaving] = useState(false);

    async function load() {
        setLoading(true);
        setError(null);
        try {
            const data = await getDetailedCities();
            setCities(data);
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

    async function handleUpdate(id: number) {
        if (!editName.trim()) return;
        setSaving(true);
        setError(null);
        try {
            await updateCity(id, editName.trim());
            setEditingId(null);
            setInfo('City updated successfully.');
            await load();
        } catch (e: unknown) {
            const err = e as { response?: { data?: { message?: string } } };
            setError(err?.response?.data?.message ?? 'Failed to update city');
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(id: number) {
        if (!window.confirm('Are you sure you want to delete this city? This will also remove all its courts and related posts.')) return;
        setError(null);
        setInfo(null);
        try {
            await deleteCity(id);
            setInfo('City deleted successfully.');
            await load();
        } catch (e: unknown) {
            const err = e as { response?: { data?: { message?: string } } };
            setError(err?.response?.data?.message ?? 'Failed to delete city. It might have related records.');
        }
    }

    const columns: Column<CityDetailed>[] = [
        {
            header: 'ID',
            accessor: 'id',
            width: 80,
            render: (row) => (
                <Typography sx={{ color: 'rgba(var(--color-text-rgb),0.6)', fontSize: '0.875rem' }}>
                    #{row.id}
                </Typography>
            ),
        },
        {
            header: 'City Name',
            accessor: 'name',
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
                        <LocationCityIcon sx={{ fontSize: 18, color: 'var(--color-accent)' }} />
                        <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>{row.name}</Typography>
                    </Stack>
                )
            ),
        },
        {
            header: 'Lawyers',
            accessor: 'lawyersCount',
            width: 150,
            render: (row) => (
                <Chip
                    icon={<PeopleIcon sx={{ fontSize: '16px !important' }} />}
                    label={row.lawyersCount}
                    variant="outlined"
                    size="small"
                    sx={{ 
                        borderRadius: '8px',
                        fontWeight: 600,
                        borderColor: 'rgba(var(--color-accent-rgb), 0.2)',
                        color: 'var(--color-text)',
                        '& .MuiChip-icon': { color: 'var(--color-accent)' }
                    }}
                />
            ),
        },
        {
            header: 'Courts',
            accessor: 'courtsCount',
            width: 150,
            render: (row) => (
                <Chip
                    icon={<AccountBalanceIcon sx={{ fontSize: '16px !important' }} />}
                    label={row.courtsCount}
                    variant="outlined"
                    size="small"
                    sx={{ 
                        borderRadius: '8px',
                        fontWeight: 600,
                        borderColor: 'rgba(var(--color-primary-rgb), 0.2)',
                        color: 'var(--color-text)',
                        '& .MuiChip-icon': { color: 'var(--color-primary)' }
                    }}
                />
            ),
        },
        {
            header: 'Actions',
            accessor: 'id',
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
                                <IconButton size="small" onClick={() => { setEditingId(row.id); setEditName(row.name); }}>
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
                            color: 'var(--color-background)',
                            textTransform: 'none',
                            fontWeight: 600,
                            '&:hover': { bgcolor: 'rgba(var(--color-primary-rgb), 0.8)' },
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
                            sx={{ 
                                flex: 1,
                                '& .MuiOutlinedInput-root': {
                                    color: 'var(--color-text)',
                                    '& fieldset': { borderColor: 'rgba(var(--color-text-rgb), 0.2)' },
                                },
                                '& .MuiInputLabel-root': { color: 'rgba(var(--color-text-rgb), 0.7)' },
                            }}
                            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                        />
                        <Button
                            variant="contained"
                            onClick={handleCreate}
                            disabled={!newName.trim() || creating}
                            sx={{
                                bgcolor: 'var(--color-primary)',
                                color: 'var(--color-background)',
                                textTransform: 'none',
                                fontWeight: 600,
                                '&:hover': { bgcolor: 'rgba(var(--color-primary-rgb), 0.8)' },
                                '&.Mui-disabled': {
                                    bgcolor: 'rgba(var(--color-primary-rgb), 0.12)',
                                    color: 'rgba(var(--color-text-rgb), 0.3)',
                                    cursor: 'not-allowed',
                                    pointerEvents: 'auto',
                                },
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
