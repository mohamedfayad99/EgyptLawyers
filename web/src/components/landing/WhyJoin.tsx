import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import BoltIcon from '@mui/icons-material/Bolt';
import GroupIcon from '@mui/icons-material/Group';
import HandshakeIcon from '@mui/icons-material/Handshake';
import { useLang } from '../../contexts/LanguageContext';

const benefits = [
    {
        icon: BoltIcon,
        en: { title: 'Find Help Fast', desc: 'Post your request and get matched with lawyers in the same city within minutes.' },
        ar: { title: 'احصل على المساعدة بسرعة', desc: 'انشر طلبك واحصل على مطابقة مع محامين في نفس المدينة خلال دقائق.' },
    },
    {
        icon: GroupIcon,
        en: { title: 'Grow Your Network', desc: 'Connect with fellow lawyers across Egypt and build lasting professional relationships.' },
        ar: { title: 'وسّع شبكتك', desc: 'تواصل مع زملائك المحامين في جميع أنحاء مصر وابنِ علاقات مهنية دائمة.' },
    },
    {
        icon: HandshakeIcon,
        en: { title: 'Collaborate Efficiently', desc: 'Share documents, exchange expertise, and coordinate cases seamlessly.' },
        ar: { title: 'تعاون بكفاءة', desc: 'شارك المستندات، تبادل الخبرات، ونسّق القضايا بسلاسة.' },
    },
];

export default function WhyJoin() {
    const { t } = useLang();

    return (
        <Box id="why-join" sx={{ py: { xs: 10, md: 14 }, bgcolor: 'var(--color-background)' }}>
            <Container maxWidth="lg">
                {/* Header */}
                <Stack alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
                    <Typography
                        sx={{
                            color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.8rem',
                            textTransform: 'uppercase', letterSpacing: 2,
                        }}
                    >
                        {t('Why Join', 'لماذا تنضم')}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: 'var(--color-text)', textAlign: 'center' }}>
                        {t('Built for Egyptian Lawyers', 'مصمم للمحامين المصريين')}
                    </Typography>
                    <Typography sx={{ color: 'rgba(var(--color-text-rgb),0.7)', maxWidth: 600, textAlign: 'center', lineHeight: 1.7 }}>
                        {t(
                            'Join a growing community of licensed lawyers who trust the network to find reliable legal assistance anywhere in Egypt.',
                            'انضم إلى مجتمع متنامٍ من المحامين المرخصين الذين يثقون بالشبكة للعثور على مساعدة قانونية موثوقة في أي مكان في مصر.',
                        )}
                    </Typography>
                </Stack>

                {/* Cards */}
                <Grid container spacing={4} sx={{ mt: 4 }}>
                    {benefits.map((b, i) => (
                        <Grid key={i} size={{ xs: 12, md: 4 }}>
                            <Box
                                sx={{
                                    textAlign: 'center', p: 5, borderRadius: 4,
                                        bgcolor: 'var(--color-surface)',
                                        border: '1px solid rgba(var(--color-text-rgb),0.06)',
                                    transition: 'all 0.3s',
                                        '&:hover': {
                                            borderColor: 'rgba(var(--color-primary-rgb),0.5)',
                                            boxShadow: '0 16px 48px rgba(15,23,42,0.06)',
                                            transform: 'translateY(-4px)',
                                        },
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 64, height: 64, borderRadius: 4, mx: 'auto', mb: 3,
                                            bgcolor: 'var(--color-primary-dark)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}
                                >
                                    <b.icon sx={{ color: 'var(--color-accent)', fontSize: 28 }} />
                                </Box>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--color-text)', mb: 1.5 }}>
                                    {t(b.en.title, b.ar.title)}
                                </Typography>
                                <Typography sx={{ color: 'rgba(var(--color-text-rgb),0.7)', lineHeight: 1.7 }}>
                                    {t(b.en.desc, b.ar.desc)}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}
