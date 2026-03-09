import { useEffect, useState, useCallback } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button,
    Typography, Box, Stack, Divider, CircularProgress, Alert, IconButton,
    Chip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useLang } from '../../contexts/LanguageContext';
import { getHelpPost, deleteHelpPost, approveHelpPost, rejectHelpPost, type Comment, type HelpPost } from '../../admin/services/helpPostService';
import ConfirmDialog from './ConfirmDialog';

interface PostDetailsModalProps {
    open: boolean;
    post: (HelpPost & { cityName?: string; courtName?: string; lawyerName?: string }) | null;
    onClose: () => void;
    onDeleteSuccess: () => void;
    onModerationSuccess?: () => void;
}

export default function PostDetailsModal({ open, post, onClose, onDeleteSuccess, onModerationSuccess }: PostDetailsModalProps) {
    const [replies, setReplies] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [moderating, setModerating] = useState(false);
    const { t } = useLang();

    const [fullPost, setFullPost] = useState<HelpPost | null>(null);

    const isPending = post?.status === 0 || String(post?.status).toLowerCase() === 'pending';
    const isOpen = post?.status === 3 || String(post?.status).toLowerCase() === 'open';

    const fetchPostDetails = useCallback(async () => {
        if (!post) return;
        setLoading(true);
        setError(null);
        try {
            const data = await getHelpPost(post.id);
            setFullPost(data);
            setReplies(data.replies || []);
        } catch (err) {
            console.error(err);
            setError(t('failedToLoadComments'));
        } finally {
            setLoading(false);
        }
    }, [post, t]);

    useEffect(() => {
        if (open && post) {
            fetchPostDetails();
        } else {
            setFullPost(null);
            setReplies([]);
        }
    }, [open, post, fetchPostDetails]);

    const handleDelete = async () => {
        if (!post) return;
        setDeleting(true);
        try {
            await deleteHelpPost(post.id);
            setConfirmDelete(false);
            onDeleteSuccess();
            onClose();
        } catch (err) {
            console.error(err);
            setError(t('failedToDeletePost'));
        } finally {
            setDeleting(false);
        }
    };

    const handleApprove = async () => {
        if (!post) return;
        setModerating(true);
        try {
            await approveHelpPost(post.id);
            onModerationSuccess?.();
            onClose();
        } catch (err) {
            console.error(err);
            setError(t('failedToApprove'));
        } finally {
            setModerating(false);
        }
    };

    const handleReject = async () => {
        if (!post) return;
        setModerating(true);
        try {
            await rejectHelpPost(post.id);
            onModerationSuccess?.();
            onClose();
        } catch (err) {
            console.error(err);
            setError(t('failedToReject'));
        } finally {
            setModerating(false);
        }
    };

    const renderReplies = (items: Comment[], level = 0) => {
        if (items.length === 0 && level === 0) {
            return (
                <Typography sx={{ py: 2, color: 'text.secondary', textAlign: 'center' }}>
                    {t('noComments')}
                </Typography>
            );
        }

        return items.map((comment) => (
            <Box key={comment.id} sx={{ ml: level * 3, mt: 1.5 }}>
                <Stack direction="row" spacing={1} alignItems="baseline">
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'var(--color-primary)' }}>
                        {comment.authorName || comment.lawyerName}:
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                        {new Date(comment.createdAtUtc).toLocaleString()}
                    </Typography>
                </Stack>
                <Typography variant="body2" sx={{ mt: 0.5, bgcolor: level > 0 ? 'rgba(0,0,0,0.02)' : 'transparent', p: level > 0 ? 1 : 0, borderRadius: 1 }}>
                    {comment.message || comment.text}
                </Typography>
                {comment.replies && comment.replies.length > 0 && (
                    <Box sx={{ mt: 1 }}>
                        {renderReplies(comment.replies, level + 1)}
                    </Box>
                )}
            </Box>
        ));
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
                <DialogTitle>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>{t('postDetails')}</Typography>
                        {isOpen && (
                            <IconButton color="error" onClick={() => setConfirmDelete(true)} disabled={deleting}>
                                <DeleteIcon />
                            </IconButton>
                        )}
                    </Stack>
                </DialogTitle>
                <DialogContent dividers>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    {post && (
                        <Box sx={{ mb: 4 }}>
                            <GridItem label={t('description')} value={fullPost?.description || post.description} isLongText />
                            <Stack direction="row" spacing={4} sx={{ mt: 2 }} flexWrap="wrap">
                                <GridItem label={t('city')} value={fullPost?.cityName || post.cityName} />
                                <GridItem label={t('court')} value={fullPost?.courtName || post.courtName} />
                                <GridItem label={t('created')} value={new Date(fullPost?.createdAtUtc || post.createdAtUtc).toLocaleString()} />
                                <GridItem label={t('lawyers')} value={fullPost?.lawyerName || post.lawyerName} />
                            </Stack>
                        </Box>
                    )}

                    <Divider sx={{ my: 3 }}>
                        <Chip label={t('replies')} size="small" />
                    </Divider>

                    <Box sx={{ minHeight: 100 }}>
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                                <CircularProgress size={24} />
                            </Box>
                        ) : (
                            renderReplies(replies)
                        )}
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2, px: 3 }}>
                    {isPending && (
                        <Stack direction="row" spacing={1} sx={{ width: '100%', justifyContent: 'flex-end' }}>
                            <Button
                                onClick={handleApprove}
                                color="primary"
                                variant="contained"
                                disabled={moderating || deleting}
                            >
                                {t('approve')}
                            </Button>
                            <Button
                                onClick={handleReject}
                                color="error"
                                variant="outlined"
                                disabled={moderating || deleting}
                            >
                                {t('reject')}
                            </Button>
                            <Button onClick={onClose} variant="outlined" sx={{ minWidth: 100 }}>
                                {t('close')}
                            </Button>
                        </Stack>
                    )}

                    {isOpen && (
                        <Button onClick={onClose} variant="outlined" sx={{ minWidth: 100 }}>
                            {t('close')}
                        </Button>
                    )}

                    {!isPending && !isOpen && (
                        <Button onClick={onClose} variant="outlined" sx={{ minWidth: 100 }}>
                            {t('close')}
                        </Button>
                    )}
                </DialogActions>
            </Dialog>

            <ConfirmDialog
                open={confirmDelete}
                title={t('deletePost')}
                message={t('confirmDeletePost')}
                confirmLabel={t('deletePost')}
                confirmColor="error"
                onConfirm={handleDelete}
                onCancel={() => setConfirmDelete(false)}
            />
        </>
    );
}

function GridItem({ label, value, isCode = false, isLongText = false }: { label: string; value?: string; isCode?: boolean; isLongText?: boolean }) {
    return (
        <Box sx={{ mb: isLongText ? 0 : 2, minWidth: isLongText ? '100%' : 120 }}>
            <Typography variant="overline" color="textSecondary" sx={{ display: 'block', lineHeight: 1.5 }}>
                {label}
            </Typography>
            <Typography
                variant="body2"
                sx={{
                    fontWeight: 500,
                    whiteSpace: isLongText ? 'pre-wrap' : 'nowrap',
                    fontFamily: isCode ? 'monospace' : 'inherit',
                    fontSize: isCode ? '0.75rem' : '0.875rem'
                }}
            >
                {value || '-'}
            </Typography>
        </Box>
    );
}

