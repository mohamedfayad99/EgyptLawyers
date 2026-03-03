import { Box, Paper, Stack, Typography } from '@mui/material';
import type { SvgIconComponent } from '@mui/icons-material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: SvgIconComponent;
    color?: string;
    trend?: string;
}

export default function StatCard({ title, value, icon: Icon, color = '#D4AF37', trend }: StatCardProps) {
    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                borderRadius: 3,
                bgcolor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                transition: 'all 0.3s',
                '&:hover': {
                    boxShadow: '0 8px 32px rgba(15,23,42,0.06)',
                    transform: 'translateY(-2px)',
                },
            }}
        >
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Stack spacing={1}>
                    <Typography sx={{ color: '#64748B', fontSize: '0.85rem', fontWeight: 500 }}>
                        {title}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A' }}>
                        {value}
                    </Typography>
                    {trend && (
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                            <TrendingUpIcon sx={{ fontSize: 16, color: '#22C55E' }} />
                            <Typography sx={{ fontSize: '0.75rem', color: '#22C55E', fontWeight: 600 }}>
                                {trend}
                            </Typography>
                        </Stack>
                    )}
                </Stack>
                <Box
                    sx={{
                        width: 48, height: 48, borderRadius: 2.5,
                        bgcolor: `${color}15`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                >
                    <Icon sx={{ fontSize: 24, color }} />
                </Box>
            </Stack>
        </Paper>
    );
}
