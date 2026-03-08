import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import StarIcon from '@mui/icons-material/Star';
import { useLang } from '../../contexts/LanguageContext';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const testimonials = [
    {
        en: {
            quote: 'This platform completely transformed how I collaborate with colleagues. I found a reliable lawyer in Alexandria within minutes to handle an urgent hearing.',
            name: 'Ahmed Khalil',
            title: 'Senior Litigation Lawyer, Cairo',
        },
        ar: {
            quote: 'غيّرت هذه المنصة طريقة تعاوني مع زملائي تمامًا. وجدت محامياً موثوقاً في الإسكندرية خلال دقائق للتعامل مع جلسة عاجلة.',
            name: 'أحمد خليل',
            title: 'محامٍ قضائي أول، القاهرة',
        },
    },
    {
        en: {
            quote: 'Finding a colleague who covers a specific court used to take days of phone calls. Now it happens instantly. The verification through Syndicate Card gives me full confidence.',
            name: 'Mona Farouq',
            title: 'Corporate Lawyer, Giza',
        },
        ar: {
            quote: 'كان العثور على زميل يغطي محكمة معينة يستغرق أياماً من المكالمات. الآن يحدث فوراً. التحقق عبر بطاقة النقابة يمنحني ثقة كاملة.',
            name: 'منى فاروق',
            title: 'محامية شركات، الجيزة',
        },
    },
    {
        en: {
            quote: 'A must-have app for any practicing lawyer in Egypt. I\'ve expanded my professional network across 5 governorates since joining last year.',
            name: 'Karim Mansour',
            title: 'Family Law Specialist, Alexandria',
        },
        ar: {
            quote: 'تطبيق لا غنى عنه لأي محامٍ ممارس في مصر. لقد وسّعت شبكتي المهنية عبر 5 محافظات منذ انضمامي العام الماضي.',
            name: 'كريم منصور',
            title: 'متخصص في قانون الأسرة، الإسكندرية',
        },
    },
];

export default function Testimonials() {
    const { t } = useLang();
    const { ref, visible } = useScrollAnimation();

    return (
        <Box
            id="testimonials"
            sx={{
                py: { xs: 10, md: 14 },
                bgcolor: 'var(--color-primary-dark)',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* subtle bg pattern */}
            <Box
                sx={{
                    position: 'absolute', inset: 0, opacity: 0.04,
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)`,
                    backgroundSize: '40px 40px',
                }}
            />

            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                {/* Header */}
                <Stack alignItems="center" spacing={1.5} sx={{ mb: 8 }}>
                    <Typography
                        sx={{
                            color: 'var(--color-accent)', fontWeight: 600, fontSize: '0.8rem',
                            textTransform: 'uppercase', letterSpacing: 2,
                        }}
                    >
                        {t('Trusted by Lawyers', 'موثوق به من المحامين')}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: 'var(--color-background)', textAlign: 'center' }}>
                        {t('What Lawyers Are Saying', 'ماذا يقول المحامون')}
                    </Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.65)', textAlign: 'center', maxWidth: 500, lineHeight: 1.7, fontSize: '0.95rem' }}>
                        {t(
                            'Join thousands of verified lawyers who rely on the network every day.',
                            'انضم إلى آلاف المحامين الموثقين الذين يعتمدون على الشبكة كل يوم.',
                        )}
                    </Typography>
                </Stack>

                {/* Cards */}
                <Grid ref={ref} container spacing={3}>
                    {testimonials.map((item, i) => (
                        <Grid key={i} size={{ xs: 12, md: 4 }} sx={{ display: 'flex' }}>
                            <Box
                                sx={{
                                    p: 4,
                                    borderRadius: 4,
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    bgcolor: 'rgba(255,255,255,0.04)',
                                    backdropFilter: 'blur(8px)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 2,
                                    flex: 1,
                                    transition: 'all 0.6s cubic-bezier(0.16,1,0.3,1)',
                                    transitionDelay: `${i * 120}ms`,
                                    opacity: visible ? 1 : 0,
                                    transform: visible ? 'translateY(0)' : 'translateY(32px)',
                                    '&:hover': {
                                        border: '1px solid rgba(var(--color-accent-rgb),0.3)',
                                        transform: 'translateY(-6px)',
                                        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                                    },
                                }}
                            >
                                {/* Quote icon */}
                                <FormatQuoteIcon sx={{ fontSize: 36, color: 'var(--color-accent)', opacity: 0.8 }} />

                                {/* Stars */}
                                <Stack direction="row" spacing={0.25}>
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <StarIcon key={s} sx={{ fontSize: 16, color: '#F59E0B' }} />
                                    ))}
                                </Stack>

                                {/* Quote text */}
                                <Typography
                                    sx={{
                                        color: 'rgba(255,255,255,0.82)',
                                        fontSize: '0.925rem',
                                        lineHeight: 1.8,
                                        fontStyle: 'italic',
                                        flex: 1,
                                    }}
                                >
                                    "{t(item.en.quote, item.ar.quote)}"
                                </Typography>

                                {/* Author */}
                                <Box
                                    sx={{
                                        pt: 2,
                                        borderTop: '1px solid rgba(255,255,255,0.08)',
                                    }}
                                >
                                    <Typography sx={{ color: 'var(--color-background)', fontWeight: 700, fontSize: '0.9rem' }}>
                                        {t(item.en.name, item.ar.name)}
                                    </Typography>
                                    <Typography sx={{ color: 'var(--color-accent)', fontSize: '0.78rem', mt: 0.25 }}>
                                        {t(item.en.title, item.ar.title)}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}
