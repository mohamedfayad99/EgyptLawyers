import {
    Box, Typography, IconButton, Stack, Avatar, Divider, Chip, Button, Modal, Skeleton, Paper, Grid, Container, Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getLawyer, approveLawyer, rejectLawyer, suspendLawyer, type Lawyer } from '../../admin/services/lawyerService';
import { useLang } from '../../contexts/LanguageContext';
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Helper to get image URL cleaning up any /api suffix from base URL
const getImageUrl = (path?: string | null) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    
    let base = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5215";
    base = base.replace(/\/api$/, '').replace(/\/$/, '');
    
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${base}${cleanPath}`;
};

export default function LawyerDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { t, lang } = useLang();
    const [lawyer, setLawyer] = useState<Lawyer | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [info, setInfo] = useState<string | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const loadData = useCallback(async () => {
        if (!id) return;
        setLoading(true);
        setError(null);
        try {
            const data = await getLawyer(id);
            setLawyer(data);
        } catch (e) {
            console.error(e);
            setError(t('failedToLoadProfile') || 'Unable to load lawyer profile.');
        } finally {
            setLoading(false);
        }
    }, [id, t]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleApprove = async () => {
        if (!lawyer) return;
        try {
            await approveLawyer(lawyer.id);
            setInfo(t('lawyerApproved'));
            loadData();
        } catch (e) {
            setError(t('failedToApprove'));
        }
    };

    const handleReject = async () => {
        if (!lawyer) return;
        try {
            await rejectLawyer(lawyer.id);
            setInfo(t('lawyerRejected'));
            loadData();
        } catch (e) {
            setError(t('failedToReject'));
        }
    };

    const handleSuspendToggle = async () => {
        if (!lawyer) return;
        try {
            await suspendLawyer(lawyer.id, !lawyer.isSuspended);
            setInfo(lawyer.isSuspended ? t('lawyerUnblocked') : t('lawyerBlocked'));
            loadData();
        } catch (e) {
            setError(t('failedToUpdateStatus'));
        }
    };

    const isRejected = lawyer?.verificationStatus === 'Rejected' || String(lawyer?.verificationStatus) === '2';
    const isApproved = lawyer?.verificationStatus === 'Approved' || String(lawyer?.verificationStatus) === '1';
    const isSuspended = lawyer?.isSuspended;

    const profilePic = getImageUrl(lawyer?.profileImageUrl);
    const idPic = getImageUrl(lawyer?.idCardImageUrl);

    const createdDate = lawyer?.createdAtUtc ? new Date(lawyer.createdAtUtc) : null;
    const updatedDate = lawyer?.updatedAtUtc ? new Date(lawyer.updatedAtUtc) : null;

    if (loading && !lawyer) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 4, mb: 4 }} />
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 4 }} />
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 4 }} />
                    </Grid>
                </Grid>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Header / Back Button */}
            <Stack direction="row" alignItems="center" spacing={2} mb={4}>
                <IconButton onClick={() => navigate(-1)} sx={{ bgcolor: 'rgba(var(--color-text-rgb), 0.05)' }}>
                    <ArrowBackIcon sx={{ transform: lang === 'ar' ? 'rotate(180deg)' : 'none' }} />
                </IconButton>
                <Typography variant="h4" fontWeight="bold">{t('lawyerProfile')}</Typography>
            </Stack>

            {info && <Alert severity="success" sx={{ mb: 3 }} onClose={() => setInfo(null)}>{info}</Alert>}
            {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>{error}</Alert>}

            <Grid container spacing={4}>
                {/* Left Column: Avatar & Basic Info */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 4, textAlign: 'center', height: '100%', borderRadius: 4 }}>
                        <Avatar 
                            src={profilePic} 
                            alt={lawyer?.fullName}
                            sx={{ 
                                width: 180, 
                                height: 180, 
                                mx: 'auto',
                                border: '6px solid rgba(var(--color-primary-rgb), 0.1)', 
                                cursor: profilePic ? 'pointer' : 'default',
                                mb: 3
                            }}
                            onClick={() => profilePic && setPreviewImage(profilePic)}
                        />
                        <Typography variant="h5" fontWeight="bold" gutterBottom>{lawyer?.fullName}</Typography>
                        <Typography variant="body1" sx={{ color: 'rgba(var(--color-text-rgb),0.6)', mb: 3 }}>
                            {lawyer?.professionalTitle || t('lawyer')}
                        </Typography>
                        
                        <Stack direction="row" spacing={1} justifyContent="center" mb={4}>
                            <Chip 
                                label={isApproved ? t('approved') : isRejected ? t('rejected') : t('pending')} 
                                color={isApproved ? "success" : isRejected ? "error" : "warning"}
                            />
                            <Chip 
                                label={isSuspended ? t('suspended') : t('active')} 
                                color={isSuspended ? "error" : "success"}
                                variant="outlined"
                            />
                        </Stack>

                        <Divider sx={{ my: 3 }} />

                        <Stack spacing={2}>
                            <Box>
                                <Typography variant="caption" color="text.secondary" display="block">{t('created')}</Typography>
                                <Typography variant="body2" fontWeight={500}>
                                    {createdDate ? createdDate.toLocaleDateString() : '-'}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary" display="block">{t('updated')}</Typography>
                                <Typography variant="body2" fontWeight={500}>
                                    {updatedDate ? updatedDate.toLocaleDateString() : '-'}
                                </Typography>
                            </Box>
                        </Stack>

                        <Box mt={4}>
                            {(!isApproved && !isRejected) && (
                                <Stack spacing={2}>
                                    <Button 
                                        fullWidth 
                                        variant="contained" 
                                        color="success" 
                                        startIcon={<CheckCircleIcon />}
                                        onClick={handleApprove}
                                        size="large"
                                    >
                                        {t('approve')}
                                    </Button>
                                    <Button 
                                        fullWidth 
                                        variant="outlined" 
                                        color="error" 
                                        startIcon={<CancelIcon />}
                                        onClick={handleReject}
                                        size="large"
                                    >
                                        {t('reject')}
                                    </Button>
                                </Stack>
                            )}
                            {isApproved && (
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    color={isSuspended ? "success" : "error"}
                                    onClick={handleSuspendToggle}
                                    size="large"
                                >
                                    {isSuspended ? t('unblock') : t('block')}
                                </Button>
                            )}
                        </Box>
                    </Paper>
                </Grid>

                {/* Right Column: Detailed Info & Images */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 4, borderRadius: 4, height: '100%' }}>
                        <Typography variant="h6" fontWeight="bold" mb={3}>{t('personalInfo') || 'Personal Information'}</Typography>
                        <Grid container spacing={3} mb={5}>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="caption" color="text.secondary">{t('whatsapp')}</Typography>
                                <Stack direction="row" alignItems="center" spacing={1} mt={0.5}>
                                    <WhatsAppIcon color="success" />
                                    <Typography variant="body1" fontWeight={600}>{lawyer?.whatsappNumber}</Typography>
                                </Stack>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="caption" color="text.secondary">{t('syndicateNo')}</Typography>
                                <Typography variant="body1" fontWeight={600} mt={0.5}>{lawyer?.syndicateCardNumber || '-'}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="caption" color="text.secondary">{t('nationalIdNumber')}</Typography>
                                <Typography variant="body1" fontWeight={600} mt={0.5}>{lawyer?.nationalIdNumber || '-'}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="caption" color="text.secondary">{t('city')}</Typography>
                                <Typography variant="body1" fontWeight={600} mt={0.5}>{lawyer?.activeCities?.join(', ') || '-'}</Typography>
                            </Grid>
                        </Grid>

                        <Divider sx={{ my: 4 }} />

                        <Typography variant="h6" fontWeight="bold" mb={3}>{t('uploadedDocuments')}</Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body2" color="text.secondary" mb={2}>{t('idCardImage')}</Typography>
                                {idPic ? (
                                    <Box 
                                        component="img"
                                        src={idPic}
                                        alt="ID Card"
                                        onClick={() => setPreviewImage(idPic)}
                                        sx={{ 
                                            width: '100%', 
                                            maxHeight: 250, 
                                            objectFit: 'contain', 
                                            borderRadius: 2,
                                            border: '1px solid rgba(var(--color-text-rgb), 0.1)',
                                            cursor: 'pointer',
                                            transition: '0.2s',
                                            '&:hover': { opacity: 0.9, transform: 'scale(1.01)' }
                                        }}
                                    />
                                ) : (
                                    <Box sx={{ p: 4, textAlign: 'center', bgcolor: 'rgba(var(--color-text-rgb), 0.05)', borderRadius: 2 }}>
                                        <Typography variant="body2" color="text.secondary">{t('noImageProvided')}</Typography>
                                    </Box>
                                )}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body2" color="text.secondary" mb={2}>{t('profileImage')}</Typography>
                                {profilePic ? (
                                    <Box 
                                        component="img"
                                        src={profilePic}
                                        alt="Profile"
                                        onClick={() => setPreviewImage(profilePic)}
                                        sx={{ 
                                            width: '100%', 
                                            maxHeight: 250, 
                                            objectFit: 'contain', 
                                            borderRadius: 2,
                                            border: '1px solid rgba(var(--color-text-rgb), 0.1)',
                                            cursor: 'pointer',
                                            transition: '0.2s',
                                            '&:hover': { opacity: 0.9, transform: 'scale(1.01)' }
                                        }}
                                    />
                                ) : (
                                    <Box sx={{ p: 4, textAlign: 'center', bgcolor: 'rgba(var(--color-text-rgb), 0.05)', borderRadius: 2 }}>
                                        <Typography variant="body2" color="text.secondary">{t('noImageProvided')}</Typography>
                                    </Box>
                                )}
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>

            {/* Modal for full image preview */}
            <Modal open={!!previewImage} onClose={() => setPreviewImage(null)} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box position="relative" sx={{ outline: 'none', maxWidth: '95%', maxHeight: '95%' }}>
                    <IconButton 
                        onClick={() => setPreviewImage(null)} 
                        sx={{ position: 'fixed', top: 20, right: 20, color: 'white', bgcolor: 'rgba(0,0,0,0.4)', '&:hover': { bgcolor: 'rgba(0,0,0,0.6)' } }}
                    >
                        <CloseIcon fontSize="large" />
                    </IconButton>
                    <img src={previewImage || ''} alt="Preview" style={{ maxWidth: '100%', maxHeight: '95vh', objectFit: 'contain', borderRadius: 8 }} />
                </Box>
            </Modal>
        </Container>
    );
}
