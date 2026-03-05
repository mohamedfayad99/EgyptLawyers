import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Alert, Chip, IconButton, MenuItem, Stack,
    TextField, Tooltip, Typography,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AdminTable, { type Column } from '../../components/admin/AdminTable';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import {
    getLawyers, approveLawyer, rejectLawyer,
    type Lawyer,
} from '../../admin/services/lawyerService';

type LawyerRow = Lawyer & Record<string, unknown>;

type ConfirmAction = {
    type: 'approve' | 'reject';
    lawyer: Lawyer;
} | null;

export default function UserManagementPage() {
    const [statusFilter, setStatusFilter] = useState<'' | 'Pending' | 'Approved' | 'Rejected'>('');
    const [lawyers, setLawyers] = useState<LawyerRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [info, setInfo] = useState<string | null>(null);
    const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);

    const statusQuery = useMemo(() => statusFilter.toLowerCase(), [statusFilter]);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getLawyers(statusFilter ? statusQuery : undefined);
            setLawyers(data as LawyerRow[]);
        } catch (e: unknown) {
            const err = e as { response?: { data?: { message?: string } } };
            setError(err?.response?.data?.message ?? 'Failed to load lawyers');
        } finally {
            setLoading(false);
        }
    }, [statusFilter, statusQuery]);

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
                    setInfo('Lawyer approved.');
                    break;
                case 'reject':
                    await rejectLawyer(lawyer.id);
                    setInfo('Lawyer rejected.');
                    break;
            }
            await load();
        } catch (e: unknown) {
            const err = e as { response?: { data?: { message?: string } } };
            setError(err?.response?.data?.message ?? `Failed to ${type} lawyer`);
        }
    }

    // Map numeric enum values (0=Pending, 1=Approved, 2=Rejected) to readable labels
    const statusLabel = (status: string | number): string => {
        if (status === 0 || String(status).toLowerCase() === 'pending')  return 'Pending';
        if (status === 1 || String(status).toLowerCase() === 'approved') return 'Approved';
        if (status === 2 || String(status).toLowerCase() === 'rejected') return 'Rejected';
        return String(status);
    };

    const statusColor = (status: string | number) => {
        const label = statusLabel(status).toLowerCase();
        if (label === 'approved') return 'success';
        if (label === 'rejected') return 'error';
        return 'warning'; // Pending
    };

    const confirmDialogConfig = useMemo(() => {
        if (!confirmAction) return { title: '', message: '', color: 'primary' as const, label: '' };
        const name = confirmAction.lawyer.fullName;
        switch (confirmAction.type) {
            case 'approve':
                return { title: 'Approve Lawyer', message: `Are you sure you want to approve ${name}?`, color: 'success' as const, label: 'Approve' };
            case 'reject':
                return { title: 'Reject Lawyer', message: `Are you sure you want to reject ${name}?`, color: 'error' as const, label: 'Reject' };
        }
    }, [confirmAction]);

    const columns: Column<LawyerRow>[] = [
        {
            header: 'Lawyer',
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
            header: 'WhatsApp',
            accessor: 'whatsappNumber' as keyof LawyerRow,
        },
        {
            header: 'Syndicate #',
            accessor: 'syndicateCardNumber' as keyof LawyerRow,
        },
        {
            header: 'Status',
            accessor: 'verificationStatus' as keyof LawyerRow,
            render: (row) => (
                <Stack direction="row" spacing={0.5} alignItems="center">
                    <Chip
                        label={statusLabel(row.verificationStatus)}
                        size="small"
                        color={statusColor(row.verificationStatus)}
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
            header: 'Registered',
            accessor: 'createdAtUtc' as keyof LawyerRow,
            render: (row) => (
                <Typography sx={{ color: 'rgba(var(--color-text-rgb),0.6)', fontSize: '0.8rem' }}>
                    {new Date(row.createdAtUtc).toLocaleDateString()}
                </Typography>
            ),
        },
        {
            header: 'Actions',
            align: 'right' as const,
            render: (row) => (
                <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                    <Tooltip title="Approve">
                        <IconButton size="small" color="success" onClick={() => setConfirmAction({ type: 'approve', lawyer: row })}>
                            <CheckCircleIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Reject">
                        <IconButton size="small" color="error" onClick={() => setConfirmAction({ type: 'reject', lawyer: row })}>
                            <CancelIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Stack>
            ),
        },
    ];

    return (
        <>
            {info && <Alert severity="success" onClose={() => setInfo(null)} sx={{ mb: 2 }}>{info}</Alert>}

            <AdminTable
                columns={columns}
                data={lawyers}
                loading={loading}
                error={error}
                onClearError={() => setError(null)}
                searchPlaceholder="Search by name, syndicate #, or phone…"
                emptyMessage="No lawyers found. Data will appear when the backend is running."
                getRowKey={(row) => row.id}
                toolbar={
                    <TextField
                        select
                        size="small"
                        label="Status"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                        sx={{ minWidth: 160 }}
                    >
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="Approved">Approved</MenuItem>
                        <MenuItem value="Rejected">Rejected</MenuItem>
                    </TextField>
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
        </>
    );
}
