import { Box, Button, Container, Grid, Stack, Typography } from '@mui/material';
import BoltIcon from '@mui/icons-material/Bolt';
import GroupIcon from '@mui/icons-material/Group';
import HandshakeIcon from '@mui/icons-material/Handshake';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useLang } from '../../contexts/LanguageContext';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const benefits = [
    {
        icon: BoltIcon,
        en: { title: 'Find Help Fast', desc: 'Post your request and receive responses from verified colleagues in the same city within minutes — not days.' },
        ar: { title: 'احصل على المساعدة بسرعة', desc: 'انشر طلبك واستلم ردوداً من زملاء موثقين في نفس المدينة خلال دقائق — وليس أياماً.' },
    },
    {
        icon: GroupIcon,
        en: { title: 'Grow Your Network', desc: 'Connect with fellow lawyers across Egypt\'s 27 governorates and build lasting professional relationships that benefit your practice.' },
        ar: { title: 'وسّع شبكتك', desc: 'تواصل مع زملائك المحامين في جميع أنحاء المحافظات المصرية الـ27 وابنِ علاقات مهنية دائمة تفيد عملك.' },
    },
    {
        icon: HandshakeIcon,
        en: { title: 'Collaborate Efficiently', desc: 'Share documents, exchange legal expertise, and coordinate cases seamlessly through a single trusted platform.' },
        ar: { title: 'تعاون بكفاءة', desc: 'شارك المستندات، تبادل الخبرات القانونية، ونسّق القضايا بسلاسة عبر منصة موثوقة واحدة.' },
    },
];

export default function WhyJoin() {
    const { t, isRTL } = useLang();
    const { ref, visible } = useScrollAnimation();

    const scrollToJoin = () => document.querySelector('#download')?.scrollIntoView({ behavior: 'smooth' });

    const ArrowIcon = isRTL ? ArrowBackIcon : ArrowForwardIcon;

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
                    <Typography sx={{ color: 'rgba(var(--color-text-rgb),0.65)', maxWidth: 600, textAlign: 'center', lineHeight: 1.7, fontSize: '0.95rem' }}>
                        {t(
                            'Join a growing community of licensed lawyers who trust the network to find reliable legal assistance anywhere in Egypt.',
                            'انضم إلى مجتمع متنامٍ من المحامين المرخصين الذين يثقون بالشبكة للعثور على مساعدة قانونية موثوقة في أي مكان في مصر.',
                        )}
                    </Typography>
                </Stack>

                {/* Cards */}
                <Grid ref={ref} container spacing={4} sx={{ mt: 4 }}>
                    {benefits.map((b, i) => (
                        <Grid key={i} size={{ xs: 12, md: 4 }} sx={{ display: 'flex' }}>
                            <Box
                                sx={{
                                    textAlign: 'center', p: 5, borderRadius: 4,
                                    bgcolor: 'var(--color-surface)',
                                    border: '1px solid rgba(var(--color-text-rgb),0.06)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    width: '100%',
                                    height: '100%',
                                    transition: 'all 0.6s cubic-bezier(0.16,1,0.3,1)',
                                    transitionDelay: `${i * 100}ms`,
                                    opacity: visible ? 1 : 0,
                                    transform: visible ? 'translateY(0)' : 'translateY(28px)',
                                    '&:hover': {
                                        borderColor: 'rgba(var(--color-primary-rgb),0.4)',
                                        boxShadow: '0 20px 60px rgba(15,23,42,0.08)',
                                        transform: 'translateY(-6px)',
                                    },
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 68, height: 68, borderRadius: 4, mx: 'auto', mb: 3,
                                        bgcolor: 'var(--color-primary-dark)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        boxShadow: '0 8px 24px rgba(15,23,42,0.2)',
                                    }}
                                >
                                    <b.icon sx={{ color: 'var(--color-accent)', fontSize: 30 }} />
                                </Box>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--color-text)', mb: 1.5 }}>
                                    {t(b.en.title, b.ar.title)}
                                </Typography>
                                <Typography sx={{ color: 'rgba(var(--color-text-rgb),0.65)', lineHeight: 1.75, fontSize: '0.9rem' }}>
                                    {t(b.en.desc, b.ar.desc)}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>

                {/* CTA block */}
                <Stack alignItems="center" spacing={2} sx={{ mt: 8 }}>
                    <Typography sx={{ color: 'rgba(var(--color-text-rgb),0.6)', fontSize: '0.9rem' }}>
                        {t('Ready to take your practice to the next level?', 'مستعد للارتقاء بعملك المهني؟')}
                    </Typography>
                    <Button
                        variant="contained"
                        endIcon={<ArrowIcon />}
                        onClick={scrollToJoin}
                        sx={{
                            bgcolor: 'var(--color-primary-dark)',
                            color: '#fff',
                            fontWeight: 700,
                            textTransform: 'none',
                            px: 4, py: 1.6,
                            fontSize: '1rem',
                            borderRadius: 2,
                            '& .MuiButton-endIcon': { mr: 0.5 },
                            '&:hover': {
                                bgcolor: 'var(--color-primary)',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 8px 24px rgba(var(--color-primary-rgb),0.35)',
                            },
                            transition: 'all 0.25s',
                        }}
                    >
                        {t('Get Started — It\'s Free', 'ابدأ الآن — مجاناً')}
                    </Button>
                </Stack>
            </Container>
        </Box>
    );
}
