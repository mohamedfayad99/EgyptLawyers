import { useEffect, useState } from 'react';
import { Box, Container, Grid, Typography, Stack } from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import ArticleIcon from '@mui/icons-material/Article';
import { useLang } from '../../contexts/LanguageContext';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const stats = [
    {
        icon: GavelIcon,
        target: 1200,
        suffix: '+',
        en: { label: 'Licensed Lawyers' },
        ar: { label: 'محامٍ مرخص' },
    },
    {
        icon: LocationCityIcon,
        target: 35,
        en: { label: 'Cities Covered' },
        ar: { label: 'مدينة مغطاة' },
    },
    {
        icon: ArticleIcon,
        target: 5000,
        suffix: '+',
        en: { label: 'Posts Created' },
        ar: { label: 'طلب منشور' },
    },
];

function Counter({ target, visible, suffix = '' }: { target: number, visible: boolean, suffix?: string }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!visible) {
            setCount(0); // Reset when not visible to allow repeat
            return;
        }

        let start = 0;
        const duration = 3000;
        const increment = target / (duration / 16);

        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                setCount(target);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 16);

        return () => clearInterval(timer);
    }, [visible, target]);

    return <>{count.toLocaleString()}{suffix}</>;
}

export default function StatsBar() {
    const { t } = useLang();
    const { ref, visible } = useScrollAnimation();

    return (
        <Box
            ref={ref}
            sx={{
                py: { xs: 8, md: 10 },
                bgcolor: 'var(--color-surface)',
                position: 'relative',
            }}
        >
            <Box
                sx={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(180deg, var(--color-background) 0%, var(--color-surface) 100%)',
                    zIndex: 0,
                }}
            />
            
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                <Grid container spacing={4} justifyContent="center">
                    {stats.map((stat, i) => (
                        <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 3,
                                    p: 4,
                                    borderRadius: '24px',
                                    bgcolor: 'var(--color-background)',
                                    boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)',
                                    border: '1px solid var(--color-border)',
                                    transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)',
                                    transitionDelay: `${i * 150}ms`,
                                    opacity: visible ? 1 : 0,
                                    transform: visible ? 'translateY(0)' : 'translateY(24px)',
                                    '&:hover': {
                                        transform: 'translateY(-6px)',
                                        boxShadow: '0 20px 40px -15px rgba(0,0,0,0.08)',
                                    },
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 64, height: 64, borderRadius: '16px',
                                        bgcolor: 'rgba(var(--color-accent-rgb),0.12)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        flexShrink: 0,
                                    }}
                                >
                                    <stat.icon sx={{ color: 'var(--color-accent)', fontSize: 32 }} />
                                </Box>
                                <Stack>
                                    <Typography
                                        sx={{
                                            fontSize: { xs: '2rem', md: '2.5rem' },
                                            fontWeight: 900,
                                            color: 'var(--color-primary-dark)',
                                            lineHeight: 1,
                                            letterSpacing: '-0.03em',
                                            mb: 0.5,
                                        }}
                                    >
                                        <Counter 
                                            target={stat.target} 
                                            visible={visible} 
                                            suffix={stat.suffix} 
                                        />
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontSize: '1rem',
                                            color: 'var(--color-secondary-text)',
                                            fontWeight: 500,
                                        }}
                                    >
                                        {t(stat.en.label, stat.ar.label)}
                                    </Typography>
                                </Stack>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}
