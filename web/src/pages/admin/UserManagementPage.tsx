import { useEffect, useMemo, useState } from 'react';
import {
    Alert, Chip, IconButton, InputAdornment, MenuItem,
    Paper, Stack, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, TextField, Tooltip, Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import BlockIcon from '@mui/icons-material/Block';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { api } from '../../api/client';

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

export default function UserManagementPage() {
    const [statusFilter, setStatusFilter] = useState<'Pending' | 'Approved' | 'Rejected' | ''>('');
    const [search, setSearch] = useState('');
    const [lawyers, setLawyers] = useState<Lawyer[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [info, setInfo] = useState<string | null>(null);

    const statusQuery = useMemo(() => statusFilter.toLowerCase(), [statusFilter]);

    async function load() {
        setError(null);
        try {
            const res = await api.get('/api/admin/lawyers', {
                params: statusFilter ? { status: statusQuery } : {},
            });
            setLawyers(res.data);
        } catch (e: any) {
            setError(e?.response?.data?.message ?? 'Failed to load lawyers');
        }
    }

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statusQuery]);

    const filtered = useMemo(() => {
        if (!search.trim()) return lawyers;
        const q = search.toLowerCase();
        return lawyers.filter(
            (l) =>
                l.fullName.toLowerCase().includes(q) ||
                l.syndicateCardNumber.toLowerCase().includes(q) ||
                l.whatsappNumber.includes(q),
        );
    }, [lawyers, search]);

    async function approve(id: string) {
        setInfo(null);
        await api.patch(`/api/admin/lawyers/${id}/approve`);
        setInfo('Lawyer approved.');
        await load();
    }

    async function reject(id: string) {
        setInfo(null);
        await api.patch(`/api/admin/lawyers/${id}/reject`);
        setInfo('Lawyer rejected.');
        await load();
    }

    async function toggleSuspend(id: string, suspended: boolean) {
        setInfo(null);
        await api.patch(`/api/admin/lawyers/${id}/suspend`, null, { params: { suspended } });
        setInfo(suspended ? 'Lawyer suspended.' : 'Lawyer unsuspended.');
        await load();
    }

    const statusColor = (status: string | number) => {
        const s = String(status).toLowerCase();
        if (s === 'approved') return 'success';
        if (s === 'rejected') return 'error';
        return 'warning';
    };

    return (
        <Stack spacing={3}>
            {error && <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>}
            {info && <Alert severity="success" onClose={() => setInfo(null)}>{info}</Alert>}

            {/* Toolbar */}
            <Paper
                elevation={0}
                sx={{
                    p: 2.5, borderRadius: 3,
                    border: '1px solid rgba(var(--color-text-rgb),0.06)',
                    bgcolor: 'var(--color-background)',
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2,
                    alignItems: { sm: 'center' },
                }}
            >
                <TextField
                    placeholder="Search by name, syndicate #, or phone…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    size="small"
                    sx={{ flex: 1, minWidth: 200 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: 'rgba(var(--color-text-rgb),0.5)' }} />
                            </InputAdornment>
                        ),
                    }}
                />
                <TextField
                    select
                    size="small"
                    label="Status"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    sx={{ minWidth: 160 }}
                >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Approved">Approved</MenuItem>
                    <MenuItem value="Rejected">Rejected</MenuItem>
                </TextField>
            </Paper>

            {/* Table */}
            <Paper
                elevation={0}
                sx={{
                    borderRadius: 3,
                    border: '1px solid rgba(var(--color-text-rgb),0.06)',
                    overflow: 'hidden',
                    bgcolor: 'var(--color-background)',
                }}
            >
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'var(--color-surface)' }}>
                                <TableCell sx={{ fontWeight: 600, color: 'var(--color-text)' }}>Lawyer</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: 'var(--color-text)' }}>WhatsApp</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: 'var(--color-text)' }}>Syndicate #</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: 'var(--color-text)' }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: 'var(--color-text)' }}>Registered</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: 'var(--color-text)' }} align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filtered.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} sx={{ textAlign: 'center', color: 'rgba(var(--color-text-rgb),0.6)', py: 6 }}>
                                        {lawyers.length === 0
                                            ? 'No lawyers found. Data will appear when the backend is running.'
                                            : 'No results match your search.'}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filtered.map((l) => (
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
                                            <Stack direction="row" spacing={0.5} alignItems="center">
                                                <Chip
                                                    label={String(l.verificationStatus)}
                                                    size="small"
                                                    color={statusColor(l.verificationStatus)}
                                                    variant="outlined"
                                                    sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                                                />
                                                {l.isSuspended && (
                                                    <Chip label="Suspended" size="small" color="default" sx={{ fontSize: '0.7rem' }} />
                                                )}
                                            </Stack>
                                        </TableCell>
                                        <TableCell sx={{ color: 'rgba(var(--color-text-rgb),0.6)', fontSize: '0.8rem' }}>
                                            {new Date(l.createdAtUtc).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell align="right">
                                            <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                                                <Tooltip title="Approve">
                                                    <IconButton size="small" color="success" onClick={() => approve(l.id)}>
                                                        <CheckCircleIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Reject">
                                                    <IconButton size="small" color="error" onClick={() => reject(l.id)}>
                                                        <CancelIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title={l.isSuspended ? 'Unsuspend' : 'Suspend'}>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => toggleSuspend(l.id, !l.isSuspended)}
                                                        sx={{ color: l.isSuspended ? 'var(--color-primary)' : 'var(--color-accent)' }}
                                                    >
                                                        {l.isSuspended ? <LockOpenIcon fontSize="small" /> : <BlockIcon fontSize="small" />}
                                                    </IconButton>
                                                </Tooltip>
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
