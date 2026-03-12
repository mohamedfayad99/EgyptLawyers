import { useEffect, useState, useCallback } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button,
    Typography, Box, Stack, Divider, CircularProgress, Alert, IconButton,
    Chip, Grid, Card, CardActionArea, CardMedia, Modal
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import DescriptionIcon from '@mui/icons-material/Description';
import { useLang } from '../../contexts/LanguageContext';
import { getHelpPost, deleteHelpPost, approveHelpPost, rejectHelpPost, type Comment, type HelpPost, type Attachment } from '../../admin/services/helpPostService';
import ConfirmDialog from './ConfirmDialog';

// Helper to get image URL cleaning up any /api suffix from base URL
const getImageUrl = (path?: string | null) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;

    let base = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5215";
    base = base.replace(/\/api$/, '').replace(/\/$/, '');

    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${base}${cleanPath}`;
};

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
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const { t } = useLang();

    const [fullPost, setFullPost] = useState<HelpPost | null>(null);

    const isPending = post?.status === 0 || String(post?.status).toLowerCase() === 'pending';

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

    const renderAttachments = (attachments?: Attachment[]) => {
        if (!attachments || attachments.length === 0) return null;

        return (
            <Box sx={{ mt: 4 }}>
                <Typography variant="overline" color="textSecondary" sx={{ fontWeight: 700, mb: 2, display: 'block' }}>
                    {t('uploadedDocuments') || 'ATTACHMENTS'}
                </Typography>
                <Grid container spacing={2}>
                    {attachments.map((att) => {
                        const isImage = att.fileType.toLowerCase().includes('image') || 
                                       ['jpg', 'jpeg', 'png', 'webp'].some(ext => att.fileUrl.toLowerCase().endsWith(ext));
                        const url = getImageUrl(att.fileUrl);

                        return (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={att.id}>
                                <Card sx={{ 
                                    height: '100%', 
                                    border: '1px solid rgba(0,0,0,0.08)',
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                        transform: 'translateY(-2px)'
                                    }
                                }}>
                                    {isImage ? (
                                        <CardActionArea onClick={() => setPreviewImage(url)}>
                                            <CardMedia
                                                component="img"
                                                height="150"
                                                image={url}
                                                alt="Attachment"
                                                sx={{ objectFit: 'cover' }}
                                            />
                                        </CardActionArea>
                                    ) : (
                                        <Box sx={{ p: 2, height: 150, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                            <DescriptionIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
                                            <Typography variant="caption" sx={{ textAlign: 'center', wordBreak: 'break-all', px: 1 }}>
                                                {att.fileType.toUpperCase()}
                                            </Typography>
                                            <Button 
                                                size="small" 
                                                component="a" 
                                                href={url} 
                                                target="_blank" 
                                                startIcon={<DownloadIcon />}
                                            >
                                                {t('download') || 'Download'}
                                            </Button>
                                        </Box>
                                    )}
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            </Box>
        );
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
                {comment.attachments && comment.attachments.length > 0 && (
                    <Box sx={{ mt: 1 }}>
                        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                            {comment.attachments.map(att => (
                                <Chip 
                                    key={att.id}
                                    size="small" 
                                    label={att.fileType} 
                                    component="a" 
                                    href={getImageUrl(att.fileUrl)} 
                                    target="_blank" 
                                    clickable 
                                    icon={<DownloadIcon />}
                                />
                            ))}
                        </Stack>
                    </Box>
                )}
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
                        <IconButton color="error" onClick={() => setConfirmDelete(true)} disabled={deleting}>
                            <DeleteIcon />
                        </IconButton>
                    </Stack>
                </DialogTitle>
                <DialogContent dividers>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    {post && (
                        <Box sx={{ mb: 2 }}>
                            {/* Section 1: Post Description */}
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="overline" color="textSecondary" sx={{ fontWeight: 700, mb: 1, display: 'block' }}>
                                    {t('description') || 'DESCRIPTION'}
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 500, whiteSpace: 'pre-wrap', color: 'text.primary' }}>
                                    {fullPost?.description || post.description}
                                </Typography>
                            </Box>

                            <Grid container spacing={2} sx={{ mb: 4, p: 2, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 2 }}>
                                <Grid size={{ xs: 6, sm: 3 }}>
                                    <GridItem label={t('city')} value={fullPost?.cityName || post.cityName} noMargin />
                                </Grid>
                                <Grid size={{ xs: 6, sm: 3 }}>
                                    <GridItem label={t('court')} value={fullPost?.courtName || post.courtName} noMargin />
                                </Grid>
                                <Grid size={{ xs: 6, sm: 3 }}>
                                    <GridItem label={t('lawyers')} value={fullPost?.lawyerName || post.lawyerName} noMargin />
                                </Grid>
                                <Grid size={{ xs: 6, sm: 3 }}>
                                    <GridItem label={t('created')} value={new Date(fullPost?.createdAtUtc || post.createdAtUtc).toLocaleDateString()} noMargin />
                                </Grid>
                            </Grid>

                            {/* Section 3: Attachments */}
                            {renderAttachments(fullPost?.attachments)}
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
                <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                    <Stack direction="row" spacing={2} sx={{ width: '100%', justifyContent: 'flex-end' }}>
                        {isPending && (
                            <>
                                <Button
                                    onClick={handleApprove}
                                    color="primary"
                                    variant="contained"
                                    disabled={moderating || deleting}
                                    sx={{ minWidth: 120, borderRadius: 2, fontWeight: 700, bgcolor: 'var(--color-primary)' }}
                                >
                                    {moderating ? <CircularProgress size={20} color="inherit" /> : t('approve')}
                                </Button>
                                <Button
                                    onClick={handleReject}
                                    color="error"
                                    variant="outlined"
                                    disabled={moderating || deleting}
                                    sx={{ minWidth: 120, borderRadius: 2, fontWeight: 700 }}
                                >
                                    {t('reject')}
                                </Button>
                            </>
                        )}
                        <Button 
                            onClick={onClose} 
                            variant="outlined" 
                            sx={{ minWidth: 100, borderRadius: 2, color: 'text.secondary', borderColor: 'divider' }}
                        >
                            {t('close')}
                        </Button>
                    </Stack>
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

            {/* Image Preview Modal */}
            <Modal
                open={!!previewImage}
                onClose={() => setPreviewImage(null)}
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}
            >
                <Box sx={{ 
                    position: 'relative', 
                    maxWidth: '90vw', 
                    maxHeight: '90vh', 
                    bgcolor: 'background.paper', 
                    boxShadow: 24, 
                    p: 1, 
                    borderRadius: 2,
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <IconButton 
                        onClick={() => setPreviewImage(null)}
                        sx={{ position: 'absolute', right: -16, top: -16, bgcolor: 'white', '&:hover': { bgcolor: '#f5f5f5' }, boxShadow: 2 }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <Box component="img" src={previewImage || ''} sx={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: 1 }} />
                </Box>
            </Modal>
        </>
    );
}

function GridItem({ label, value, isCode = false, isLongText = false, noMargin = false }: { label: string; value?: string; isCode?: boolean; isLongText?: boolean; noMargin?: boolean }) {
    return (
        <Box sx={{ mb: noMargin ? 0 : isLongText ? 0 : 2, minWidth: isLongText ? '100%' : 'auto' }}>
            <Typography variant="overline" color="textSecondary" sx={{ display: 'block', lineHeight: 1.5, fontWeight: 700 }}>
                {label}
            </Typography>
            <Typography
                variant="body2"
                sx={{
                    fontWeight: 500,
                    whiteSpace: isLongText ? 'pre-wrap' : 'normal',
                    fontFamily: isCode ? 'monospace' : 'inherit',
                    fontSize: isCode ? '0.75rem' : '0.875rem'
                }}
            >
                {value || '-'}
            </Typography>
        </Box>
    );
}

