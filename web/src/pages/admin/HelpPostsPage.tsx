import { useEffect, useState } from 'react';
import { MenuItem, TextField, Typography, Box, Alert } from '@mui/material';
import AdminTable, { type Column } from '../../components/admin/AdminTable';
import { getHelpPosts, type HelpPost } from '../../admin/services/helpPostService';
import { getCities, type City } from '../../admin/services/cityService';
import { getCourts, type Court } from '../../admin/services/courtService';
import { getLawyers, type Lawyer } from '../../admin/services/lawyerService';
import { useLang } from '../../contexts/LanguageContext';

import PostDetailsModal from '../../components/admin/PostDetailsModal';

type PostRow = HelpPost & { cityName?: string; courtName?: string; lawyerName?: string } & Record<string, unknown>;

export default function HelpPostsPage() {
    const [posts, setPosts] = useState<PostRow[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [courts, setCourts] = useState<Court[]>([]);
    const [lawyers, setLawyers] = useState<Lawyer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const [filterCityId, setFilterCityId] = useState<number | ''>('');
    const [filterCourtId, setFilterCourtId] = useState<number | ''>('');

    // Modal state
    const [selectedPost, setSelectedPost] = useState<PostRow | null>(null);
    const { t } = useLang();

    useEffect(() => {
        async function loadMeta() {
            try {
                const [c, co, l] = await Promise.all([getCities(), getCourts(), getLawyers()]);
                setCities(c);
                setCourts(co);
                setLawyers(l);
            } catch { /* silently fallback */ }
        }
        loadMeta();
    }, []);

    useEffect(() => {
        loadPosts();
    }, [filterCityId, filterCourtId, cities, courts, lawyers]);

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
            const lawyerMap = new Map(lawyers.map((l) => [l.id, l.fullName]));
            setPosts(
                (data as PostRow[]).map((p) => ({
                    ...p,
                    cityName: cityMap.get(p.cityId) ?? `City #${p.cityId}`,
                    courtName: courtMap.get(p.courtId) ?? `Court #${p.courtId}`,
                    lawyerName: lawyerMap.get(p.lawyerId) ?? `Lawyer #${p.lawyerId.slice(0, 8)}`,
                })),
            );
        } catch (e: unknown) {
            const err = e as { response?: { data?: { message?: string } } };
            setError(err?.response?.data?.message ?? t('failedToLoadPosts'));
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
            header: t('description'),
            accessor: 'description' as keyof PostRow,
            render: (row) => (
                <Typography sx={{ fontSize: '0.875rem', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {row.description}
                </Typography>
            ),
        },
        {
            header: t('city'),
            accessor: 'cityName' as keyof PostRow,
        },
        {
            header: t('court'),
            accessor: 'courtName' as keyof PostRow,
        },
        {
            header: t('status'),
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
                    {t(statusLabel(row.status).toLowerCase() as any) ?? statusLabel(row.status)}
                </Typography>
            ),
        },
        {
            header: t('created'),
            accessor: 'createdAtUtc' as keyof PostRow,
            render: (row) => (
                <Typography sx={{ fontSize: '0.8rem', color: 'rgba(var(--color-text-rgb),0.6)' }}>
                    {new Date(row.createdAtUtc).toLocaleDateString()}
                </Typography>
            ),
        },
        {
            header: t('lawyer'),
            accessor: 'lawyerName' as keyof PostRow,
            render: (row) => (
                <Typography sx={{ fontSize: '0.8rem', color: 'rgba(var(--color-text-rgb),0.8)' }}>
                    {row.lawyerName}
                </Typography>
            ),
        },
    ];

    return (
        <Box>
            <Box mb={2}>
                <Typography sx={{ color: 'rgba(var(--color-text-rgb),0.7)', fontSize: '0.9rem' }}>
                    {t('postsSubtitle')}
                </Typography>
            </Box>

            {successMsg && (
                <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMsg(null)}>
                    {successMsg}
                </Alert>
            )}

            <AdminTable
                columns={columns}
                data={posts}
                loading={loading}
                error={error}
                onClearError={() => setError(null)}
                searchPlaceholder={t('searchPosts')}
                emptyMessage={t('noPosts')}
                getRowKey={(row) => row.id}
                onRowClick={(row) => setSelectedPost(row)}
                toolbar={
                    <>
                        <TextField
                            select
                            size="small"
                            label={t('city')}
                            value={filterCityId}
                            onChange={(e) => {
                                setFilterCityId(e.target.value === '' ? '' : Number(e.target.value));
                                setFilterCourtId('');
                            }}
                            sx={{ minWidth: 150 }}
                        >
                            <MenuItem value="">{t('allCities')}</MenuItem>
                            {cities.map((c) => (
                                <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            select
                            size="small"
                            label={t('court')}
                            value={filterCourtId}
                            onChange={(e) => setFilterCourtId(e.target.value === '' ? '' : Number(e.target.value))}
                            sx={{ minWidth: 150 }}
                        >
                            <MenuItem value="">{t('allCourts')}</MenuItem>
                            {(filterCityId ? courts.filter((c) => c.cityId === filterCityId) : courts).map((c) => (
                                <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                            ))}
                        </TextField>
                    </>
                }
            />

            <PostDetailsModal
                open={!!selectedPost}
                post={selectedPost}
                onClose={() => setSelectedPost(null)}
                onDeleteSuccess={() => {
                    setSuccessMsg(t('postDeleted'));
                    loadPosts();
                }}
            />
        </Box>
    );
}

