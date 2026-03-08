import { useCallback, useEffect, useState } from 'react';
import {
    Chip, Stack,
    Typography, Box, Tooltip, IconButton
} from '@mui/material';
import BlockIcon from '@mui/icons-material/Block';
import AdminTable, { type Column } from '../../components/admin/AdminTable';
import {
    getLawyers, rejectLawyer, suspendLawyer,
    type Lawyer,
} from '../../admin/services/lawyerService';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { useLang } from '../../contexts/LanguageContext';

type LawyerRow = Lawyer & Record<string, unknown>;

export default function UserManagementPage() {
    const [lawyers, setLawyers] = useState<LawyerRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [confirmBlock, setConfirmBlock] = useState<Lawyer | null>(null);
    const { t } = useLang();

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
            header: t('status'),
            accessor: 'verificationStatus' as keyof LawyerRow,
            render: (row) => (
                <Stack direction="row" spacing={0.5} alignItems="center">
                    <Chip
                        label={t('approved')}
                        size="small"
                        color="success"
                        variant="outlined"
                        sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                    />
                    {row.isSuspended && (
                        <Chip label="Suspended" size="small" color="default" sx={{ fontSize: '0.7rem' }} />
                    )}
                </Stack>
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
                <Tooltip title={t('block')}>
                    <IconButton
                        size="small"
                        color="error"
                        onClick={() => setConfirmBlock(row)}
                        sx={{
                            bgcolor: 'rgba(211, 47, 47, 0.04)',
                            '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.08)' }
                        }}
                    >
                        <BlockIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            ),
        },
    ];

    async function executeBlock() {
        if (!confirmBlock) return;
        setLoading(true);
        setError(null);
        try {
            // First reject the lawyer (this moves them to Approvals/Rejected status)
            await rejectLawyer(confirmBlock.id);
            // Also suspend them so we can identify them as "Blocked" on the Approvals page
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

