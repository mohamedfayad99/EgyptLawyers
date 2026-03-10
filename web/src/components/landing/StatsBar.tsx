import { useEffect, useState } from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import DownloadingIcon from '@mui/icons-material/Downloading';
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
        target: 27,
        en: { label: 'Governorates Covered' },
        ar: { label: 'محافظة مغطاة' },
    },
    {
        icon: VerifiedUserIcon,
        target: 100,
        suffix: '%',
        en: { label: 'Syndicate Verified' },
        ar: { label: 'موثق بالنقابة' },
    },
    {
        icon: DownloadingIcon,
        target: 3,
        suffixEn: ' Steps',
        suffixAr: ' خطوات',
        en: { label: 'To Start Connecting' },
        ar: { label: 'للبدء في التواصل' },
    },
];

function Counter({ target, visible, suffix = '' }: { target: number, visible: boolean, suffix?: string }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!visible) return;

        let start = 0;
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 16ms per frame (approx 60fps)

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
    const { t, lang } = useLang();
    const { ref, visible } = useScrollAnimation();

    return (
        <Box
            ref={ref}
            sx={{
                py: { xs: 5, md: 6 },
                bgcolor: 'var(--color-surface)',
                borderTop: '1px solid rgba(var(--color-primary-rgb),0.1)',
                borderBottom: '1px solid rgba(var(--color-primary-rgb),0.1)',
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={2} justifyContent="center">
                    {stats.map((stat, i) => (
                        <Grid key={i} size={{ xs: 6, md: 3 }}>
                            <Box
                                sx={{
                                    textAlign: 'center',
                                    py: { xs: 2, md: 3 },
                                    px: 2,
                                    borderRadius: 3,
                                    transition: 'all 0.6s cubic-bezier(0.16,1,0.3,1)',
                                    transitionDelay: `${i * 100}ms`,
                                    opacity: visible ? 1 : 0,
                                    transform: visible ? 'translateY(0)' : 'translateY(24px)',
                                    '&:hover': {
                                        bgcolor: 'rgba(var(--color-primary-rgb),0.06)',
                                        transform: 'translateY(-4px)',
                                    },
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 48, height: 48, borderRadius: 2,
                                        bgcolor: 'rgba(var(--color-primary-rgb),0.1)',
                                        mx: 'auto', mb: 1.5,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}
                                >
                                    <stat.icon sx={{ color: 'var(--color-primary)', fontSize: 24 }} />
                                </Box>
                                <Typography
                                    sx={{
                                        fontSize: { xs: '1.6rem', md: '2rem' },
                                        fontWeight: 800,
                                        color: 'var(--color-primary-dark)',
                                        lineHeight: 1.1,
                                    }}
                                >
                                    <Counter 
                                        target={stat.target} 
                                        visible={visible} 
                                        suffix={lang === 'ar' ? (stat.suffixAr || stat.suffix) : (stat.suffixEn || stat.suffix)} 
                                    />
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: '0.8rem',
                                        color: 'rgba(var(--color-text-rgb),0.6)',
                                        fontWeight: 500,
                                        mt: 0.5,
                                    }}
                                >
                                    {t(stat.en.label, stat.ar.label)}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}
