import { useCallback, useEffect, useState, useMemo } from 'react';
import {
    Alert, IconButton, Stack,
    Tooltip, Typography, Box, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AdminTable, { type Column } from '../../components/admin/AdminTable';
import {
    getLawyers, approveLawyer, rejectLawyer,
    type Lawyer,
} from '../../admin/services/lawyerService';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { useLang } from '../../contexts/LanguageContext';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';

type LawyerRow = Lawyer & Record<string, unknown>;

type ConfirmAction = {
    type: 'approve' | 'reject';
    lawyer: Lawyer;
} | null;

export default function PendingApprovalsPage() {
    const [lawyers, setLawyers] = useState<LawyerRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [info, setInfo] = useState<string | null>(null);
    const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'rejected' | 'blocked'>('all');
    const { t } = useLang();
    const navigate = useNavigate();

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Fetch both pending and rejected lawyers
            const [pending, rejected] = await Promise.all([
                getLawyers('pending'),
                getLawyers('rejected')
            ]);
            // Combine, filter mock data, and sort by date descending
            const combined = [...pending, ...rejected]
                .filter(l => l.id !== 'string')
                .sort(
                    (a, b) => new Date(b.createdAtUtc).getTime() - new Date(a.createdAtUtc).getTime()
                );
            setLawyers(combined as LawyerRow[]);
        } catch (e: unknown) {
            const err = e as { response?: { data?: { message?: string } } };
            setError(err?.response?.data?.message ?? t('failedToLoadLawyers'));
        } finally {
            setLoading(false);
        }
    }, []);

    const filteredLawyers = useMemo(() => {
        if (statusFilter === 'all') return lawyers;
        return lawyers.filter(l => {
            const isRejected = l.verificationStatus === 'Rejected' || String(l.verificationStatus) === '2';
            const isBlocked = l.isSuspended;
            const isPending = !isRejected && !isBlocked;

            if (statusFilter === 'blocked') return isBlocked;
            if (statusFilter === 'rejected') return isRejected && !isBlocked;
            if (statusFilter === 'pending') return isPending;
            return true;
        });
    }, [lawyers, statusFilter]);

    useEffect(() => { load(); }, [load]);

    async function executeAction() {
        if (!confirmAction) return;
        const { type, lawyer } = confirmAction;
        setInfo(null);
        setError(null);
        setConfirmAction(null);
        try {
            switch (type) {
                case 'approve':
                    await approveLawyer(lawyer.id);
                    setInfo(t('lawyerApproved'));
                    break;
                case 'reject':
                    await rejectLawyer(lawyer.id);
                    setInfo(t('lawyerRejected'));
                    break;
            }
            await load();
        } catch (e: unknown) {
            console.error(e);
            const err = e as { response?: { data?: any } };
            const backendError = err?.response?.data?.message || err?.response?.data?.detail || err?.response?.data;
            const errorKey = type === 'approve' ? 'failedToApprove' : 'failedToReject';
            setError(typeof backendError === 'string' ? backendError : t(errorKey));
        }
    }

    const confirmDialogConfig = useMemo(() => {
        if (!confirmAction) return { title: '', message: '', color: 'primary' as const, label: '' };
        const name = confirmAction.lawyer.fullName;
        switch (confirmAction.type) {
            case 'approve':
                return { title: t('approveLawyer'), message: `${t('approveMsg')} ${name}?`, color: 'success' as const, label: t('approve') };
            case 'reject':
                return { title: t('rejectLawyer'), message: `${t('rejectMsg')} ${name}?`, color: 'error' as const, label: t('reject') };
        }
    }, [confirmAction, t]);

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
            header: t('status'),
            accessor: 'verificationStatus' as keyof LawyerRow,
            render: (row) => {
                const isRejected = row.verificationStatus === 'Rejected' || String(row.verificationStatus) === '2';
                const isBlocked = row.isSuspended;
                return (
                    <Typography
                        sx={{
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            color: isBlocked ? 'error.dark' : isRejected ? 'error.main' : 'warning.main',
                            textTransform: 'uppercase'
                        }}
                    >
                        {isBlocked ? t('blocked') : isRejected ? t('rejected') : t('pending')}
                    </Typography>
                );
            }
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
            render: (row) => {
                const isRejected = row.verificationStatus === 'Rejected' || String(row.verificationStatus) === '2';

                return (
                    <Stack direction="row" spacing={0.5} justifyContent="flex-end" onClick={(e) => e.stopPropagation()}>
                        <Tooltip title={t('viewDetails') || 'View Details'}>
                            <IconButton
                                size="small"
                                color="info"
                                onClick={() => navigate(`/admin/pending-approvals/${row.id}`)}
                            >
                                <VisibilityIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={t('approve')}>
                            <IconButton
                                size="small"
                                color="success"
                                onClick={() => setConfirmAction({ type: 'approve', lawyer: row })}
                            >
                                <CheckCircleIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        {!isRejected && (
                            <Tooltip title={t('reject')}>
                                <IconButton size="small" color="error" onClick={() => setConfirmAction({ type: 'reject', lawyer: row })}>
                                    <CancelIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}
                    </Stack>
                );
            },
        },
    ];

    return (
        <Stack spacing={2}>
            <Box>
                <Typography sx={{ mb: 0.5, color: 'rgba(var(--color-text-rgb),0.7)', fontSize: '0.9rem' }}>
                    {t('pendingSubtitle')}
                </Typography>
            </Box>

            {info && <Alert severity="success" onClose={() => setInfo(null)} sx={{ mb: 2 }}>{info}</Alert>}

            <AdminTable
                columns={columns}
                data={filteredLawyers}
                loading={loading}
                error={error}
                onClearError={() => setError(null)}
                searchPlaceholder={t('searchLawyers')}
                emptyMessage={t('noPending')}
                getRowKey={(row) => row.id}
                onRowClick={(row) => navigate(`/admin/pending-approvals/${row.id}`)}
                toolbar={
                    <FormControl size="small" sx={{ 
                        minWidth: 150,
                        '& .MuiInputLabel-root': { color: 'rgba(var(--color-text-rgb), 0.7)' },
                        '& .MuiOutlinedInput-root': {
                            color: 'var(--color-text)',
                            '& fieldset': { borderColor: 'rgba(var(--color-text-rgb), 0.15)' },
                            '&:hover fieldset': { borderColor: 'rgba(var(--color-text-rgb), 0.3)' },
                        },
                        '& .MuiSelect-icon': { color: 'var(--color-text)' }
                    }}>
                        <InputLabel sx={{ color: 'rgba(var(--color-text-rgb), 0.7)' }}>{t('filterByStatus')}</InputLabel>
                        <Select
                            value={statusFilter}
                            label={t('filterByStatus')}
                            onChange={(e) => setStatusFilter(e.target.value as any)}
                        >
                            <MenuItem value="all">{t('allStatuses')}</MenuItem>
                            <MenuItem value="pending">{t('pending')}</MenuItem>
                            <MenuItem value="rejected">{t('rejected')}</MenuItem>
                            <MenuItem value="blocked">{t('blocked')}</MenuItem>
                        </Select>
                    </FormControl>
                }
            />

            <ConfirmDialog
                open={confirmAction !== null}
                title={confirmDialogConfig.title}
                message={confirmDialogConfig.message}
                confirmLabel={confirmDialogConfig.label}
                confirmColor={confirmDialogConfig.color}
                onConfirm={executeAction}
                onCancel={() => setConfirmAction(null)}
            />


        </Stack>
    );
}
