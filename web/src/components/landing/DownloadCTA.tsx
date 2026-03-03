import { Box, Button, Container, Stack, Typography } from '@mui/material';
import AppleIcon from '@mui/icons-material/Apple';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useLang } from '../../contexts/LanguageContext';

export default function DownloadCTA() {
    const { t } = useLang();

    return (
        <Box
            id="download"
            sx={{
                py: { xs: 10, md: 14 },
                bgcolor: '#0F172A',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Background glow */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 600, height: 600,
                    bgcolor: 'rgba(212,175,55,0.04)',
                    borderRadius: '50%',
                    filter: 'blur(80px)',
                }}
            />

            <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
                <Stack alignItems="center" spacing={4} sx={{ textAlign: 'center' }}>
                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 800, color: '#F8FAFC',
                            fontSize: { xs: '1.8rem', md: '2.8rem' },
                        }}
                    >
                        {t('Ready to Join the Network?', 'مستعد للانضمام إلى الشبكة؟')}
                    </Typography>
                    <Typography sx={{ color: 'rgba(212,175,55,0.6)', fontSize: '1.1rem', lineHeight: 1.7, maxWidth: 540 }}>
                        {t(
                            'Download the app today and connect with thousands of verified lawyers across Egypt. Your next case partner is just a tap away.',
                            'حمّل التطبيق اليوم وتواصل مع آلاف المحامين الموثقين في جميع أنحاء مصر. شريكك القانوني القادم على بعد نقرة واحدة.',
                        )}
                    </Typography>
                    <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap justifyContent="center">
                        <Button
                            variant="contained"
                            startIcon={<AppleIcon />}
                            sx={{
                                bgcolor: '#D4AF37', color: '#0F172A', fontWeight: 700,
                                px: 4, py: 1.5, fontSize: '1rem', borderRadius: 2,
                                '&:hover': { bgcolor: '#B8962E' },
                            }}
                        >
                            {t('Download on App Store', 'حمّل من آب ستور')}
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<PlayArrowIcon />}
                            sx={{
                                bgcolor: '#D4AF37', color: '#0F172A', fontWeight: 700,
                                px: 4, py: 1.5, fontSize: '1rem', borderRadius: 2,
                                '&:hover': { bgcolor: '#B8962E' },
                            }}
                        >
                            {t('Get it on Google Play', 'احصل عليه من جوجل بلاي')}
                        </Button>
                    </Stack>
                </Stack>
            </Container>
        </Box>
    );
}
