import { useState, useMemo } from 'react';
import {
    Alert, Box, InputAdornment, Paper, Skeleton, Stack, Table,
    TableBody, TableCell, TableContainer, TableHead, TablePagination,
    TableRow, TextField, Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import InboxIcon from '@mui/icons-material/Inbox';

export interface Column<T> {
    header: string;
    accessor?: keyof T;
    render?: (row: T) => React.ReactNode;
    align?: 'left' | 'center' | 'right';
    width?: number | string;
}

interface AdminTableProps<T> {
    columns: Column<T>[];
    data: T[];
    loading?: boolean;
    error?: string | null;
    onClearError?: () => void;
    searchPlaceholder?: string;
    emptyMessage?: string;
    getRowKey: (row: T) => string | number;
    toolbar?: React.ReactNode;
    rowsPerPageOptions?: number[];
    onRowClick?: (row: T) => void;
}

export default function AdminTable<T extends Record<string, unknown>>({
    columns,
    data,
    loading = false,
    error = null,
    onClearError,
    searchPlaceholder = 'Search…',
    emptyMessage = 'No data found.',
    getRowKey,
    toolbar,
    rowsPerPageOptions = [10, 25, 50],
    onRowClick,
}: AdminTableProps<T>) {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);

    const filtered = useMemo(() => {
        if (!search.trim()) return data;
        const q = search.toLowerCase();
        return data.filter((row) =>
            columns.some((col) => {
                if (!col.accessor) return false;
                const val = row[col.accessor];
                return val != null && String(val).toLowerCase().includes(q);
            }),
        );
    }, [data, search, columns]);

    const paged = useMemo(
        () => filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
        [filtered, page, rowsPerPage],
    );

    // reset page when filter changes
    useMemo(() => setPage(0), [search, data]);

    return (
        <Stack spacing={2}>
            {error && (
                <Alert severity="error" onClose={onClearError}>
                    {error}
                </Alert>
            )}

            {/* Toolbar */}
            <Paper
                elevation={0}
                sx={{
                    p: 2.5,
                    borderRadius: 3,
                    border: '1px solid rgba(var(--color-text-rgb),0.06)',
                    bgcolor: 'var(--color-background)',
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2,
                    alignItems: { sm: 'center' },
                    flexWrap: 'wrap',
                }}
            >
                <TextField
                    placeholder={searchPlaceholder}
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
                {toolbar}
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
                                {columns.map((col, i) => (
                                    <TableCell
                                        key={i}
                                        align={col.align ?? 'left'}
                                        sx={{ fontWeight: 600, color: 'var(--color-text)', width: col.width }}
                                    >
                                        {col.header}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={`skel-${i}`}>
                                        {columns.map((_, j) => (
                                            <TableCell key={j}>
                                                <Skeleton variant="text" width="80%" />
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : paged.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        sx={{ textAlign: 'center', py: 8 }}
                                    >
                                        <Stack alignItems="center" spacing={1}>
                                            <InboxIcon sx={{ fontSize: 48, color: 'rgba(var(--color-text-rgb),0.2)' }} />
                                            <Typography sx={{ color: 'rgba(var(--color-text-rgb),0.5)', fontSize: '0.9rem' }}>
                                                {filtered.length === 0 && data.length > 0
                                                    ? 'No results match your search.'
                                                    : emptyMessage}
                                            </Typography>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paged.map((row) => (
                                    <TableRow
                                        key={getRowKey(row)}
                                        hover
                                        onClick={onRowClick ? () => onRowClick(row) : undefined}
                                        sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
                                    >
                                        {columns.map((col, j) => (
                                            <TableCell
                                                key={j}
                                                align={col.align ?? 'left'}
                                                sx={{ fontSize: '0.875rem', color: 'rgba(var(--color-text-rgb),0.85)' }}
                                            >
                                                {col.render
                                                    ? col.render(row)
                                                    : col.accessor
                                                        ? String(row[col.accessor] ?? '')
                                                        : ''}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {!loading && filtered.length > rowsPerPageOptions[0] && (
                    <Box sx={{ borderTop: '1px solid rgba(var(--color-text-rgb),0.06)' }}>
                        <TablePagination
                            component="div"
                            count={filtered.length}
                            page={page}
                            onPageChange={(_, p) => setPage(p)}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={(e) => {
                                setRowsPerPage(parseInt(e.target.value, 10));
                                setPage(0);
                            }}
                            rowsPerPageOptions={rowsPerPageOptions}
                        />
                    </Box>
                )}
            </Paper>
        </Stack>
    );
}
