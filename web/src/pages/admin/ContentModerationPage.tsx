import { useEffect, useState } from 'react';
import {
    Alert, Box, Button, Grid, MenuItem, Paper, Stack,
    Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, TextField, Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { api } from '../../api/client';

type City = { id: number; name: string };

export default function ContentModerationPage() {
    const [cities, setCities] = useState<City[]>([]);
    const [newCityName, setNewCityName] = useState('');
    const [newCourtName, setNewCourtName] = useState('');
    const [newCourtCityId, setNewCourtCityId] = useState<number | ''>('');
    const [error, setError] = useState<string | null>(null);
    const [info, setInfo] = useState<string | null>(null);

    async function loadCities() {
        try {
            const res = await api.get('/api/cities');
            setCities(res.data);
        } catch (e: any) {
            setError(e?.response?.data?.message ?? 'Failed to load cities');
        }
    }

    useEffect(() => {
        loadCities();
    }, []);

    async function createCity() {
        setInfo(null);
        setError(null);
        try {
            await api.post('/api/admin/cities', { name: newCityName });
            setNewCityName('');
            setInfo('City created successfully.');
            await loadCities();
        } catch (e: any) {
            setError(e?.response?.data?.message ?? 'Failed to create city');
        }
    }

    async function createCourt() {
        setInfo(null);
        setError(null);
        if (newCourtCityId === '') return;
        try {
            await api.post('/api/admin/courts', { name: newCourtName, cityId: newCourtCityId });
            setNewCourtName('');
            setInfo('Court created successfully.');
        } catch (e: any) {
            setError(e?.response?.data?.message ?? 'Failed to create court');
        }
    }

    return (
        <Stack spacing={3}>
            {error && <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>}
            {info && <Alert severity="success" onClose={() => setInfo(null)}>{info}</Alert>}

            <Grid container spacing={3}>
                {/* Add City */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid rgba(var(--color-text-rgb),0.06)', bgcolor: 'var(--color-background)', height: '100%' }}>
                        <Stack spacing={3}>
                            <Stack direction="row" alignItems="center" spacing={1.5}>
                                <Box
                                    sx={{
                                        width: 40, height: 40, borderRadius: 2,
                                        bgcolor: 'rgba(var(--color-primary-rgb),0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}
                                >
                                    <LocationCityIcon sx={{ color: 'var(--color-primary)' }} />
                                </Box>
                                <Box>
                                    <Typography sx={{ fontWeight: 700, color: 'var(--color-text)' }}>Add New City</Typography>
                                    <Typography sx={{ color: 'rgba(var(--color-text-rgb),0.7)', fontSize: '0.8rem' }}>
                                        Create a new city for lawyer matching
                                    </Typography>
                                </Box>
                            </Stack>

                            <TextField
                                label="City name"
                                value={newCityName}
                                onChange={(e) => setNewCityName(e.target.value)}
                                fullWidth
                                size="small"
                            />
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={createCity}
                                disabled={!newCityName.trim()}
                                sx={{
                                    bgcolor: 'var(--color-primary)', textTransform: 'none', fontWeight: 600,
                                    '&:hover': { bgcolor: '#346fda' },
                                }}
                            >
                                Add City
                            </Button>
                        </Stack>
                    </Paper>
                </Grid>

                {/* Add Court */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid rgba(var(--color-text-rgb),0.06)', bgcolor: 'var(--color-background)', height: '100%' }}>
                        <Stack spacing={3}>
                            <Stack direction="row" alignItems="center" spacing={1.5}>
                                <Box
                                    sx={{
                                        width: 40, height: 40, borderRadius: 2,
                                        bgcolor: 'rgba(var(--color-accent-rgb),0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}
                                >
                                    <AccountBalanceIcon sx={{ color: 'var(--color-accent)' }} />
                                </Box>
                                <Box>
                                    <Typography sx={{ fontWeight: 700, color: 'var(--color-text)' }}>Add New Court</Typography>
                                    <Typography sx={{ color: 'rgba(var(--color-text-rgb),0.7)', fontSize: '0.8rem' }}>
                                        Link a new court to an existing city
                                    </Typography>
                                </Box>
                            </Stack>

                            <TextField
                                label="Court name"
                                value={newCourtName}
                                onChange={(e) => setNewCourtName(e.target.value)}
                                fullWidth
                                size="small"
                            />
                            <TextField
                                select
                                label="Select city"
                                value={newCourtCityId}
                                onChange={(e) => setNewCourtCityId(Number(e.target.value))}
                                fullWidth
                                size="small"
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
                                startIcon={<AddIcon />}
                                onClick={createCourt}
                                disabled={!newCourtName.trim() || newCourtCityId === ''}
                                sx={{
                                    bgcolor: 'var(--color-primary)', textTransform: 'none', fontWeight: 600,
                                    '&:hover': { bgcolor: '#346fda' },
                                }}
                            >
                                Add Court
                            </Button>
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>

            {/* Cities List */}
            <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid rgba(var(--color-text-rgb),0.06)', overflow: 'hidden', bgcolor: 'var(--color-background)' }}>
                <Box sx={{ px: 3, py: 2.5, borderBottom: '1px solid var(--color-surface)' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--color-text)' }}>
                        Registered Cities
                    </Typography>
                    <Typography sx={{ color: 'rgba(var(--color-text-rgb),0.7)', fontSize: '0.85rem', mt: 0.5 }}>
                        All cities currently available in the system
                    </Typography>
                </Box>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'var(--color-surface)' }}>
                                <TableCell sx={{ fontWeight: 600, color: 'var(--color-text)' }}>ID</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: 'var(--color-text)' }}>City Name</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {cities.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={2} sx={{ textAlign: 'center', color: 'rgba(var(--color-text-rgb),0.6)', py: 6 }}>
                                        No cities found. Data will appear when the backend is running.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                cities.map((c) => (
                                    <TableRow key={c.id} hover>
                                        <TableCell sx={{ color: 'rgba(var(--color-text-rgb),0.6)', width: 80 }}>#{c.id}</TableCell>
                                        <TableCell>
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                <LocationCityIcon sx={{ fontSize: 18, color: 'rgba(var(--color-text-rgb),0.6)' }} />
                                                <Typography sx={{ fontWeight: 500, fontSize: '0.9rem' }}>{c.name}</Typography>
                                            </Stack>
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
