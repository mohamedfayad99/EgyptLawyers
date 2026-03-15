import {
    Drawer, Box, Typography, IconButton, Stack, Avatar, Divider, Chip, Button, Modal, Skeleton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import RefreshIcon from '@mui/icons-material/Refresh';
import { getLawyer, type Lawyer } from '../../admin/services/lawyerService';
import { useLang } from '../../contexts/LanguageContext';
import { useState, useEffect, useCallback } from 'react';

interface LawyerProfileDrawerProps {
    open: boolean;
    lawyerId: string | null;
    onClose: () => void;
    onApprove?: (lawyer: Lawyer) => void;
    onReject?: (lawyer: Lawyer) => void;
}

// Helper to get image URL cleaning up any /api suffix from base URL
const getImageUrl = (path?: string | null) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    
    let base = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5215";
    // Remove trailing /api or / if if exists to avoid double paths
    base = base.replace(/\/api$/, '').replace(/\/$/, '');
    
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${base}${cleanPath}`;
};

export default function LawyerProfileDrawer({ open, lawyerId, onClose, onApprove, onReject }: LawyerProfileDrawerProps) {
    const { t } = useLang();
    const [lawyer, setLawyer] = useState<Lawyer | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const loadData = useCallback(async () => {
        if (!lawyerId) return;
        setLoading(true);
        setError(null);
        try {
            const data = await getLawyer(lawyerId);
            setLawyer(data);
        } catch (e) {
            console.error(e);
            setError(t('failedToLoadProfile') || 'Unable to load lawyer profile.');
        } finally {
            setLoading(false);
        }
    }, [lawyerId, t]);

    useEffect(() => {
        if (open && lawyerId) {
            loadData();
        } else if (!open) {
            setLawyer(null);
        }
    }, [open, lawyerId, loadData]);

    const isRejected = lawyer?.verificationStatus === 'Rejected' || String(lawyer?.verificationStatus) === '2';
    const isApproved = lawyer?.verificationStatus === 'Approved' || String(lawyer?.verificationStatus) === '1';
    const isSuspended = lawyer?.isSuspended;

    const profilePic = getImageUrl(lawyer?.profileImageUrl);
    const idPic = getImageUrl(lawyer?.idCardImageUrl);

    const createdDate = lawyer?.createdAtUtc ? new Date(lawyer.createdAtUtc) : null;
    const updatedDate = lawyer?.updatedAtUtc ? new Date(lawyer.updatedAtUtc) : null;

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            disableScrollLock
            PaperProps={{
                sx: { 
                    width: { xs: '100%', sm: 450, md: 550 }, 
                    bgcolor: 'var(--color-bg)', 
                    color: 'var(--color-text)',
                    px: 3, 
                    py: 4 
                }
            }}
        >
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
                <Typography variant="h6" fontWeight="bold">
                    {t('lawyerProfile')}
                </Typography>
                <IconButton onClick={onClose} sx={{ color: 'rgba(var(--color-text-rgb),0.5)' }}>
                    <CloseIcon />
                </IconButton>
            </Stack>

            {error ? (
                <Stack alignItems="center" spacing={2} mt={10}>
                    <Typography color="error">{error}</Typography>
                    <Button startIcon={<RefreshIcon />} onClick={loadData} variant="outlined">{t('retry') || 'Retry'}</Button>
                </Stack>
            ) : (
                <Stack spacing={4} sx={{ overflowY: 'auto', flex: 1 }}>
                    {/* Section 1: Header/Avatar */}
                    <Stack alignItems="center" spacing={2}>
                        {loading ? (
                            <Skeleton variant="circular" width={140} height={140} />
                        ) : (
                            <Avatar 
                                src={profilePic} 
                                alt={lawyer?.fullName}
                                sx={{ 
                                    width: 140, 
                                    height: 140, 
                                    border: '4px solid rgba(var(--color-text-rgb),0.1)', 
                                    cursor: profilePic ? 'pointer' : 'default' 
                                }}
                                onClick={() => profilePic && setPreviewImage(profilePic)}
                            />
                        )}
                        <Box textAlign="center" width="100%">
                            {loading ? (
                                <Stack alignItems="center">
                                    <Skeleton width="60%" height={32} />
                                    <Skeleton width="40%" height={24} />
                                </Stack>
                            ) : (
                                <>
                                    <Typography variant="h5" fontWeight="bold">{lawyer?.fullName}</Typography>
                                    <Typography sx={{ color: 'rgba(var(--color-text-rgb),0.6)' }}>
                                        {lawyer?.professionalTitle || t('lawyer')}
                                    </Typography>
                                    <Stack direction="row" spacing={1} justifyContent="center" mt={1}>
                                        <Chip 
                                            size="small" 
                                            label={isApproved ? t('approved') : isRejected ? t('rejected') : t('pending')} 
                                            color={isApproved ? "success" : isRejected ? "error" : "warning"}
                                        />
                                        <Chip 
                                            size="small" 
                                            label={isSuspended ? t('suspended') : t('active')} 
                                            color={isSuspended ? "error" : "success"}
                                            variant="outlined"
                                        />
                                    </Stack>
                                </>
                            )}
                        </Box>
                    </Stack>

                    <Divider sx={{ borderColor: 'rgba(var(--color-text-rgb), 0.1)' }} />

                    {/* Section 2: Contact Information */}
                    <Box>
                        <Typography variant="subtitle2" color="rgba(var(--color-text-rgb),0.6)" mb={1} textTransform="uppercase">
                            {t('contactInfo')}
                        </Typography>
                        {loading ? <Skeleton width="50%" /> : (
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <WhatsAppIcon color="success" />
                                <Typography>{lawyer?.whatsappNumber}</Typography>
                            </Stack>
                        )}
                    </Box>

                    <Divider sx={{ borderColor: 'rgba(var(--color-text-rgb), 0.1)' }} />

                    {/* Section 3 & 4: Professional & Identification */}
                    <Box>
                        <Typography variant="subtitle2" color="rgba(var(--color-text-rgb),0.6)" mb={2} textTransform="uppercase">
                            {t('professionalIdInfo')}
                        </Typography>
                        <Stack spacing={2}>
                            <Box>
                                <Typography variant="caption" color="rgba(var(--color-text-rgb),0.5)">{t('syndicateNo')}</Typography>
                                {loading ? <Skeleton width="40%" /> : <Typography fontWeight={500}>{lawyer?.syndicateCardNumber || '-'}</Typography>}
                            </Box>
                            <Box>
                                <Typography variant="caption" color="rgba(var(--color-text-rgb),0.5)">{t('nationalIdNumber')}</Typography>
                                {loading ? <Skeleton width="40%" /> : <Typography fontWeight={500}>{lawyer?.nationalIdNumber || '-'}</Typography>}
                            </Box>
                        </Stack>
                    </Box>

                    <Divider sx={{ borderColor: 'rgba(var(--color-text-rgb), 0.1)' }} />

                    {/* Section 5: Uploaded Documents */}
                    <Box>
                        <Typography variant="subtitle2" color="rgba(var(--color-text-rgb),0.6)" mb={2} textTransform="uppercase">
                            {t('uploadedDocuments') || 'Uploaded Documents'}
                        </Typography>
                        <Stack spacing={3}>
                            <Box>
                                <Typography variant="caption" color="rgba(var(--color-text-rgb),0.5)" display="block" mb={1}>
                                    {t('idCardImage')}
                                </Typography>
                                {loading ? <Skeleton variant="rectangular" height={150} sx={{ borderRadius: 2 }} /> : idPic ? (
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
                                    <Typography variant="body2" color="rgba(var(--color-text-rgb),0.5)">{t('noImageProvided')}</Typography>
                                )}
                            </Box>
                            
                            <Box>
                                <Typography variant="caption" color="rgba(var(--color-text-rgb),0.5)" display="block" mb={1}>
                                    {t('profileImage') || 'Profile Image'}
                                </Typography>
                                {loading ? <Skeleton variant="rectangular" height={150} sx={{ borderRadius: 2 }} /> : profilePic ? (
                                    <Box 
                                        component="img"
                                        src={profilePic}
                                        alt="Profile Image"
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
                                    <Typography variant="body2" color="rgba(var(--color-text-rgb),0.5)">{t('noImageProvided')}</Typography>
                                )}
                            </Box>
                        </Stack>
                    </Box>

                    <Divider sx={{ borderColor: 'rgba(var(--color-text-rgb), 0.1)' }} />

                    {/* Section 7: Metadata */}
                    <Stack direction="row" spacing={4}>
                        <Box>
                            <Typography variant="caption" color="rgba(var(--color-text-rgb),0.5)">{t('created')}</Typography>
                            {loading ? <Skeleton width={100} /> : (
                                <Typography variant="body2" color="rgba(var(--color-text-rgb),0.8)">
                                    {createdDate ? `${createdDate.toLocaleDateString()} — ${createdDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : '-'}
                                </Typography>
                            )}
                        </Box>
                        <Box>
                            <Typography variant="caption" color="rgba(var(--color-text-rgb),0.5)">{t('updated')}</Typography>
                            {loading ? <Skeleton width={100} /> : (
                                <Typography variant="body2" color="rgba(var(--color-text-rgb),0.8)">
                                    {updatedDate ? `${updatedDate.toLocaleDateString()} — ${updatedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : '-'}
                                </Typography>
                            )}
                        </Box>
                    </Stack>
                </Stack>
            )}

            {/* Actions for Pending Approvals */}
            {onApprove && onReject && !isApproved && !isRejected && lawyer && !loading && (
                <Stack direction="row" spacing={2} mt="auto" pt={4}>
                    <Button 
                        fullWidth 
                        variant="outlined" 
                        color="error" 
                        startIcon={<CancelIcon />}
                        onClick={() => onReject(lawyer)}
                    >
                        {t('reject')}
                    </Button>
                    <Button 
                        fullWidth 
                        variant="contained" 
                        color="success" 
                        startIcon={<CheckCircleIcon />}
                        onClick={() => onApprove(lawyer)}
                    >
                        {t('approve')}
                    </Button>
                </Stack>
            )}

            {/* Full Screen Image Preview Modal */}
            <Modal open={!!previewImage} onClose={() => setPreviewImage(null)} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1400 }}>
                <Box position="relative" sx={{ outline: 'none', maxWidth: '95%', maxHeight: '95%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IconButton 
                        onClick={() => setPreviewImage(null)} 
                        sx={{ position: 'fixed', top: 20, right: 20, color: 'white', bgcolor: 'rgba(0,0,0,0.5)', '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' } }}
                    >
                        <CloseIcon fontSize="large" />
                    </IconButton>
                    <img src={previewImage || ''} alt="Preview" style={{ maxWidth: '100%', maxHeight: '95vh', objectFit: 'contain', borderRadius: 8, boxShadow: '0 0 20px rgba(0,0,0,0.5)' }} />
                </Box>
            </Modal>
        </Drawer>
    );
}
