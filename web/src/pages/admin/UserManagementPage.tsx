import { useCallback, useEffect, useState } from 'react';
import {
    Stack,
    Typography, Box, Tooltip, IconButton
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BlockIcon from '@mui/icons-material/Block';
import AdminTable, { type Column } from '../../components/admin/AdminTable';
import {
    getLawyers, rejectLawyer, suspendLawyer,
    type Lawyer,
} from '../../admin/services/lawyerService';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { useLang } from '../../contexts/LanguageContext';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';

type LawyerRow = Lawyer & Record<string, unknown>;

export default function UserManagementPage() {
    const [lawyers, setLawyers] = useState<LawyerRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [confirmBlock, setConfirmBlock] = useState<Lawyer | null>(null);
    const { t } = useLang();
    const navigate = useNavigate();

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Only fetch Approved lawyers per spec
            const data = await getLawyers('approved');
            setLawyers((data as LawyerRow[]).filter(l => l.id !== 'string'));
        } catch (e: unknown) {
            const err = e as { response?: { data?: { message?: string } } };
            setError(err?.response?.data?.message ?? t('failedToLoadLawyers'));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const columns: Column<LawyerRow>[] = [
        {
            header: t('name'),
            accessor: 'fullName' as keyof LawyerRow,
            render: (row) => (
                <>
                    <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>{row.fullName}</Typography>
                    {row.professionalTitle && (
                        <Typography sx={{ color: 'rgba(var(--color-text-rgb),0.6)', fontSize: '0.75rem' }}>
                            {row.professionalTitle}
                        </Typography>
                    )}
                </>
            ),
        },
        {
            header: t('whatsapp'),
            accessor: 'whatsappNumber' as keyof LawyerRow,
        },
        {
            header: t('syndicateNo'),
            accessor: 'syndicateCardNumber' as keyof LawyerRow,
        },
        {
            header: t('city'),
            accessor: 'activeCities' as keyof LawyerRow,
            render: (row) => (
                <Typography sx={{ fontSize: '0.8125rem' }}>
                    {row.activeCities?.join(', ') || '-'}
                </Typography>
            ),
        },
        {
            header: t('registered'),
            accessor: 'createdAtUtc' as keyof LawyerRow,
            render: (row) => (
                <Typography sx={{ color: 'rgba(var(--color-text-rgb),0.6)', fontSize: '0.8rem' }}>
                    {new Date(row.createdAtUtc).toLocaleDateString()}
                </Typography>
            ),
        },
        {
            header: t('actions'),
            align: 'right' as const,
            render: (row) => (
                <Stack direction="row" spacing={1} justifyContent="flex-end" onClick={(e) => e.stopPropagation()}>
                    <Tooltip title={t('viewDetails') || 'View Details'}>
                        <IconButton
                            size="small"
                            color="info"
                            onClick={() => navigate(`/admin/lawyers/${row.id}`)}
                            sx={{
                                bgcolor: 'rgba(2, 136, 209, 0.04)',
                                '&:hover': { bgcolor: 'rgba(2, 136, 209, 0.08)' }
                            }}
                        >
                            <VisibilityIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={row.isSuspended ? t('unblock') : t('block')}>
                        <IconButton
                            size="small"
                            color={row.isSuspended ? "success" : "error"}
                            onClick={() => row.isSuspended ? executeUnblock(row) : setConfirmBlock(row)}
                            sx={{
                                bgcolor: row.isSuspended ? 'rgba(76, 175, 80, 0.04)' : 'rgba(211, 47, 47, 0.04)',
                                '&:hover': { bgcolor: row.isSuspended ? 'rgba(76, 175, 80, 0.08)' : 'rgba(211, 47, 47, 0.08)' }
                            }}
                        >
                            <CheckCircleIcon fontSize="small" sx={{ display: row.isSuspended ? 'block' : 'none' }} />
                            <BlockIcon fontSize="small" sx={{ display: row.isSuspended ? 'none' : 'block' }} />
                        </IconButton>
                    </Tooltip>
                </Stack>
            ),
        },
    ];

    async function executeUnblock(lawyer: Lawyer) {
        setLoading(true);
        setError(null);
        try {
            await suspendLawyer(lawyer.id, false);
            await load();
        } catch (e: unknown) {
            console.error(e);
            setError(t('failedToUnblock'));
        } finally {
            setLoading(false);
        }
    }

    async function executeBlock() {
        if (!confirmBlock) return;
        setLoading(true);
        setError(null);
        try {
            await rejectLawyer(confirmBlock.id);
            await suspendLawyer(confirmBlock.id, true);
            setConfirmBlock(null);
            await load();
        } catch (e: unknown) {
            console.error(e);
            setError(t('failedToBlock'));
        } finally {
            setLoading(false);
        }
    }


    return (
        <Stack spacing={2}>
            <Box>
                <Typography sx={{ mb: 0.5, color: 'rgba(var(--color-text-rgb),0.7)', fontSize: '0.9rem' }}>
                    {t('lawyersSubtitle')}
                </Typography>
            </Box>

            <AdminTable
                columns={columns}
                data={lawyers}
                loading={loading}
                error={error}
                onClearError={() => setError(null)}
                searchPlaceholder={t('searchLawyers')}
                emptyMessage={t('noLawyers')}
                getRowKey={(row) => row.id}
                onRowClick={(row) => navigate(`/admin/lawyers/${row.id}`)}
            />

            <ConfirmDialog
                open={confirmBlock !== null}
                title={t('blockLawyer')}
                message={`${t('blockMsg')} ${confirmBlock?.fullName}?`}
                confirmLabel={t('block')}
                confirmColor="error"
                onConfirm={executeBlock}
                onCancel={() => setConfirmBlock(null)}
            />


        </Stack>
    );
}

