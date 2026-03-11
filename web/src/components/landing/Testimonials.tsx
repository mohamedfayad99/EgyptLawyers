import { Box, Container, Grid, Stack, Typography, Avatar } from '@mui/material';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import StarIcon from '@mui/icons-material/Star';
import { useLang } from '../../contexts/LanguageContext';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const testimonials = [
    {
        name: 'Ahmed Khalil',
        nameAr: 'أحمد خليل',
        title: 'Senior Litigation Lawyer',
        titleAr: 'محامٍ قضائي أول، القاهرة',
        imageUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
        quote: 'This platform completely transformed how I collaborate with colleagues. I found a reliable lawyer in Alexandria within minutes to handle an urgent hearing.',
        quoteAr: 'غيّرت هذه المنصة طريقة تعاوني مع زملائي تمامًا. وجدت محامياً موثوقاً في الإسكندرية خلال دقائق للتعامل مع جلسة عاجلة.',
    },
    {
        name: 'Mona Farouq',
        nameAr: 'منى فاروق',
        title: 'Corporate Lawyer',
        titleAr: 'محامية شركات، الجيزة',
        imageUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
        quote: 'Finding a colleague who covers a specific court used to take days of phone calls. Now it happens instantly. The verification through Syndicate Card gives me full confidence.',
        quoteAr: 'كان العثور على زميل يغطي محكمة معينة يستغرق أياماً من المكالمات. الآن يحدث فوراً. التحقق عبر بطاقة النقابة يمنحني ثقة كاملة.',
    },
    {
        name: 'Rania Ali',
        nameAr: 'رانيا علي',
        title: 'Family Law Specialist',
        titleAr: 'متخصصة في قانون الأسرة',
        imageUrl: 'https://i.pravatar.cc/150?u=a04258114e29026702d',
        quote: 'A must-have app for any practicing lawyer in Egypt. I\'ve expanded my professional network across 5 governorates since joining last year.',
        quoteAr: 'تطبيق لا غنى عنه لأي محامٍ ممارس في مصر. لقد وسّعت شبكتي المهنية عبر 5 محافظات منذ انضمامي العام الماضي.',
    },
];

export default function Testimonials() {
    const { t, isRTL } = useLang();
    const { ref, visible } = useScrollAnimation();

    return (
        <Box
            id="testimonials"
            sx={{
                py: { xs: 12, md: 16 },
                bgcolor: 'var(--color-surface)',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                {/* Header */}
                <Stack alignItems="center" spacing={2} sx={{ mb: 10 }}>
                    <Box
                        sx={{
                            display: 'inline-flex', px: 2, py: 0.75, borderRadius: '16px',
                            bgcolor: 'rgba(var(--color-primary-rgb),0.06)', border: '1px solid rgba(var(--color-primary-rgb),0.1)',
                        }}
                    >
                        <Typography sx={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '0.85rem' }}>
                            {t('Trusted by Lawyers', 'موثوق به من المحامين')}
                        </Typography>
                    </Box>
                    <Typography variant="h2" sx={{ fontWeight: 800, color: 'var(--color-primary-dark)', textAlign: 'center', fontSize: { xs: '2.2rem', md: '3rem' }, letterSpacing: '-0.02em' }}>
                        {t('What Lawyers Are Saying', 'ماذا يقول المحامون')}
                    </Typography>
                    <Typography sx={{ color: 'var(--color-secondary-text)', textAlign: 'center', maxWidth: 600, lineHeight: 1.7, fontSize: '1.1rem' }}>
                        {t(
                            'Join thousands of verified lawyers who rely on the network every day.',
                            'انضم إلى آلاف المحامين الموثقين الذين يعتمدون على الشبكة كل يوم.',
                        )}
                    </Typography>
                </Stack>

                {/* Cards */}
                <Grid ref={ref} container spacing={4}>
                    {testimonials.map((item, i) => (
                        <Grid key={i} size={{ xs: 12, md: 4 }} sx={{ display: 'flex' }}>
                            <Box
                                sx={{
                                    p: { xs: 4, md: 5 },
                                    borderRadius: '24px',
                                    bgcolor: 'var(--color-background)',
                                    display: 'flex', flexDirection: 'column', gap: 3, flex: 1,
                                    border: '1px solid var(--color-border)',
                                    transition: 'all 1s cubic-bezier(0.16,1,0.3,1)',
                                    transitionDelay: `${i * 150}ms`,
                                    opacity: visible ? 1 : 0,
                                    transform: visible ? 'translateY(0)' : 'translateY(32px)',
                                    boxShadow: '0 10px 30px -10px rgba(0,0,0,0.03)',
                                    position: 'relative',
                                    '&:hover': {
                                        borderColor: 'rgba(var(--color-primary-rgb), 0.3)',
                                        transform: 'translateY(-8px)',
                                        boxShadow: '0 25px 50px -12px rgba(var(--color-primary-rgb), 0.1)',
                                    },
                                }}
                            >
                                {/* Quote Icon Watermark */}
                                <FormatQuoteIcon sx={{ 
                                    position: 'absolute', 
                                    top: 24, 
                                    right: isRTL ? 'auto' : 32, 
                                    left: isRTL ? 32 : 'auto',
                                    fontSize: 80, 
                                    color: 'rgba(var(--color-primary-rgb), 0.04)',
                                    transform: isRTL ? 'scaleX(-1)' : 'none'
                                }} />

                                {/* Avatar and Info */}
                                <Stack direction="row" alignItems="center">
                                    <Avatar 
                                        src={item.imageUrl} 
                                        alt={item.name} 
                                        sx={{ 
                                            width: 56, 
                                            height: 56,
                                            mr: isRTL ? 0 : 2,
                                            ml: isRTL ? 2.5 : 0,
                                        }} 
                                    />
                                    <Stack>
                                        <Typography sx={{ color: 'var(--color-text)', fontWeight: 800, fontSize: '1.05rem' }}>
                                            {t(item.name, item.nameAr)}
                                        </Typography>
                                        <Typography sx={{ color: 'var(--color-secondary-text)', fontSize: '0.85rem' }}>
                                            {t(item.title, item.titleAr)}
                                        </Typography>
                                    </Stack>
                                </Stack>

                                {/* Stars */}
                                <Stack direction="row" spacing={0.5}>
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <StarIcon key={s} sx={{ fontSize: 18, color: '#F59E0B' }} />
                                    ))}
                                </Stack>

                                {/* Quote */}
                                <Typography
                                    sx={{
                                        color: 'var(--color-text)',
                                        fontSize: '1rem',
                                        lineHeight: 1.8,
                                        fontWeight: 500,
                                        flex: 1,
                                    }}
                                >
                                    "{t(item.quote, item.quoteAr)}"
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}
