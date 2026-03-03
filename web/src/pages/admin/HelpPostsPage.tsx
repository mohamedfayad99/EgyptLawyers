import { useEffect, useState } from 'react';
import { MenuItem, TextField, Typography } from '@mui/material';
import AdminTable, { type Column } from '../../components/admin/AdminTable';
import { getHelpPosts, type HelpPost } from '../../admin/services/helpPostService';
import { getCities, type City } from '../../admin/services/cityService';
import { getCourts, type Court } from '../../admin/services/courtService';

type PostRow = HelpPost & { cityName?: string; courtName?: string } & Record<string, unknown>;

export default function HelpPostsPage() {
    const [posts, setPosts] = useState<PostRow[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [courts, setCourts] = useState<Court[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [filterCityId, setFilterCityId] = useState<number | ''>('');
    const [filterCourtId, setFilterCourtId] = useState<number | ''>('');

    useEffect(() => {
        async function loadMeta() {
            try {
                const [c, co] = await Promise.all([getCities(), getCourts()]);
                setCities(c);
                setCourts(co);
            } catch { /* silently fallback */ }
        }
        loadMeta();
    }, []);

    useEffect(() => {
        loadPosts();
    }, [filterCityId, filterCourtId, cities, courts]);

    async function loadPosts() {
        setLoading(true);
        setError(null);
        try {
            const data = await getHelpPosts(
                filterCityId === '' ? undefined : filterCityId,
                filterCourtId === '' ? undefined : filterCourtId,
            );
            const cityMap = new Map(cities.map((c) => [c.id, c.name]));
            const courtMap = new Map(courts.map((c) => [c.id, c.name]));
            setPosts(
                (data as PostRow[]).map((p) => ({
                    ...p,
                    cityName: cityMap.get(p.cityId) ?? `City #${p.cityId}`,
                    courtName: courtMap.get(p.courtId) ?? `Court #${p.courtId}`,
                })),
            );
        } catch (e: unknown) {
            const err = e as { response?: { data?: { message?: string } } };
            setError(err?.response?.data?.message ?? 'Failed to load help posts');
        } finally {
            setLoading(false);
        }
    }

    const statusLabel = (s: string | number) => {
        const val = String(s);
        if (val === '0' || val.toLowerCase() === 'open') return 'Open';
        if (val === '1' || val.toLowerCase() === 'closed') return 'Closed';
        return val;
    };

    const columns: Column<PostRow>[] = [
        {
            header: 'Description',
            accessor: 'description' as keyof PostRow,
            render: (row) => (
                <Typography sx={{ fontSize: '0.875rem', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {row.description}
                </Typography>
            ),
        },
        {
            header: 'City',
            accessor: 'cityName' as keyof PostRow,
        },
        {
            header: 'Court',
            accessor: 'courtName' as keyof PostRow,
        },
        {
            header: 'Status',
            accessor: 'status' as keyof PostRow,
            render: (row) => (
                <Typography
                    sx={{
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: String(row.status).toLowerCase() === 'open' || row.status === 0
                            ? 'var(--color-primary)'
                            : 'rgba(var(--color-text-rgb),0.5)',
                    }}
                >
                    {statusLabel(row.status)}
                </Typography>
            ),
        },
        {
            header: 'Created',
            accessor: 'createdAtUtc' as keyof PostRow,
            render: (row) => (
                <Typography sx={{ fontSize: '0.8rem', color: 'rgba(var(--color-text-rgb),0.6)' }}>
                    {new Date(row.createdAtUtc).toLocaleDateString()}
                </Typography>
            ),
        },
        {
            header: 'Lawyer ID',
            accessor: 'lawyerId' as keyof PostRow,
            render: (row) => (
                <Typography sx={{ fontSize: '0.75rem', color: 'rgba(var(--color-text-rgb),0.5)', fontFamily: 'monospace' }}>
                    {row.lawyerId.slice(0, 8)}…
                </Typography>
            ),
        },
    ];

    return (
        <AdminTable
            columns={columns}
            data={posts}
            loading={loading}
            error={error}
            onClearError={() => setError(null)}
            searchPlaceholder="Search help posts…"
            emptyMessage="No help posts found."
            getRowKey={(row) => row.id}
            toolbar={
                <>
                    <TextField
                        select
                        size="small"
                        label="City"
                        value={filterCityId}
                        onChange={(e) => {
                            setFilterCityId(e.target.value === '' ? '' : Number(e.target.value));
                            setFilterCourtId('');
                        }}
                        sx={{ minWidth: 150 }}
                    >
                        <MenuItem value="">All Cities</MenuItem>
                        {cities.map((c) => (
                            <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        select
                        size="small"
                        label="Court"
                        value={filterCourtId}
                        onChange={(e) => setFilterCourtId(e.target.value === '' ? '' : Number(e.target.value))}
                        sx={{ minWidth: 150 }}
                    >
                        <MenuItem value="">All Courts</MenuItem>
                        {(filterCityId ? courts.filter((c) => c.cityId === filterCityId) : courts).map((c) => (
                            <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                        ))}
                    </TextField>
                </>
            }
        />
    );
}
