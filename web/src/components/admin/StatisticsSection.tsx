import { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Grid, Stack, CircularProgress
} from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { api } from '../../api/client';

type StatisticsData = {
  citiesWithMostPosts: { city: string; count: number }[];
  citiesWithMostLawyers: { city: string; count: number }[];
  citiesWithActivity: { city: string; count: number }[];
  courtsWithMostRequests: { court: string; count: number }[];
  courtsPerCity: { city: string; count: number }[];
  courtsWithRequests: { court: string; city: string; count: number }[];
  verifiedVsPendingLawyers: { status: string; count: number }[];
  activeLawyersCreators: number;
  activeLawyersRepliers: number;
  topContributingLawyers: { lawyer: string; count: number }[];
  postsTrend: { day: string; count: number }[];
  cityActivityStacked: { city: string; posts: number; replies: number }[];
  lawyerTrend: string;
};

const CHART_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

const MultilineTick = ({ x, y, payload }: any) => {
  if (!payload || !payload.value) return null;
  const words = payload.value.split(' ');
  return (
    <g transform={`translate(${x},${y})`}>
      {words.map((word: string, i: number) => (
        <text
          key={i}
          x={0}
          y={i * 12}
          dy={16}
          textAnchor="middle"
          fill="rgba(var(--color-text-rgb),0.5)"
          style={{ fontSize: '10px' }}
        >
          {word}
        </text>
      ))}
    </g>
  );
};

export default function StatisticsSection() {
  const [data, setData] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/api/admin/statistics');
        setData(res.data);
      } catch (err) {
        console.error('Failed to load statistics', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!data) return null;

  const renderCard = (title: string, children: React.ReactNode, dark = false) => (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 4,
        border: dark ? 'none' : '1px solid rgba(var(--color-text-rgb),0.06)',
        bgcolor: dark ? '#0a0a0a' : 'var(--color-background)',
        color: dark ? '#fff' : 'var(--color-text)',
        height: '100%',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, opacity: dark ? 0.9 : 1, color: dark ? '#fff' : 'var(--color-text)' }}>
        {title}
      </Typography>
      {children}
    </Paper>
  );

  const totalInteractions = data.cityActivityStacked.reduce((acc, curr) => acc + curr.posts + curr.replies, 0);

  return (
    <Stack spacing={4} sx={{ mt: 2 }}>
      {/* Hero Section - Platform Overview */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 5 },
              borderRadius: 6,
              bgcolor: '#0a0a0a',
              color: '#fff',
              backgroundImage: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(0,0,0,0) 100%)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <Grid container spacing={5} alignItems="center">
              <Grid size={{ xs: 12, md: 4 }}>
                <Typography sx={{ opacity: 0.6, fontSize: '0.95rem', mb: 1, letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 600 }}>
                  Engagement Overview
                </Typography>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1.5 }}>
                  <Typography variant="h1" sx={{ fontWeight: 800, letterSpacing: '-2px' }}>
                    {(totalInteractions / 1000).toFixed(1)}K
                  </Typography>
                  <Box
                    sx={{
                      px: 2,
                      py: 0.75,
                      borderRadius: 10,
                      bgcolor: data.lawyerTrend.startsWith('+') ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                      color: data.lawyerTrend.startsWith('+') ? '#4ade80' : '#f87171',
                      fontSize: '0.9rem',
                      fontWeight: 800,
                      border: '1px solid rgba(255,255,255,0.05)'
                    }}
                  >
                    {data.lawyerTrend}
                  </Box>
                </Stack>
                <Typography sx={{ opacity: 0.5, fontSize: '0.95rem', lineHeight: 1.6, maxWidth: 300 }}>
                  Real-time aggregation of lawyer help requests and community responses.
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 8 }}>
                <Box sx={{ height: 280, width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.cityActivityStacked} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                      <XAxis
                        dataKey="city"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
                        dy={10}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
                      />
                      <RechartsTooltip
                        contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px' }}
                        itemStyle={{ color: '#fff', fontSize: '13px' }}
                        cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                      />
                      <Bar dataKey="posts" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} name="Help Posts" />
                      <Bar dataKey="replies" stackId="a" fill="#60a5fa" radius={[6, 6, 0, 0]} name="Replies" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Advanced Metrics Section */}
      <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.5px', mt: 4, mb: -1, color: 'var(--color-text)' }}>
        Platform Performance
      </Typography>

      <Grid container spacing={3}>
        {/* Engagement Card */}
        <Grid size={{ xs: 12, md: 6 }}>
          {renderCard("City-Specific Engagement", (
            <Stack spacing={2.5}>
              <Typography sx={{ opacity: 0.6, fontSize: '0.85rem', mb: 1, color: 'var(--color-text)' }}>Total expert replies to help requests</Typography>
              {data.cityActivityStacked
                .filter(city => city.posts > 0 || city.replies > 0)
                .slice(0, 5)
                .map((city, idx) => {
                const totalReplies = city.replies;
                const maxReplies = Math.max(...data.cityActivityStacked.map(c => c.replies), 1);
                const percentage = (totalReplies / maxReplies) * 100;
                return (
                  <Box key={idx}>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                      <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text)' }}>{city.city}</Typography>
                      <Typography sx={{ fontWeight: 800, color: 'var(--color-primary)', fontSize: '0.9rem' }}>
                        {totalReplies} {totalReplies === 1 ? 'reply' : 'replies'}
                      </Typography>
                    </Stack>
                    <Box sx={{ width: '100%', height: 8, bgcolor: 'rgba(var(--color-primary-rgb),0.06)', borderRadius: 10, overflow: 'hidden' }}>
                      <Box
                        sx={{
                          width: `${percentage}%`,
                          height: '100%',
                          background: 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-accent) 100%)',
                          borderRadius: 10,
                          transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                      />
                    </Box>
                  </Box>
                );
              })}
            </Stack>
          ))}
        </Grid>

        {/* Verification Pie Card */}
        <Grid size={{ xs: 12, md: 6 }}>
          {renderCard("Lawyer Onboarding Status", (
            <Box sx={{ height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.verifiedVsPendingLawyers}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    innerRadius={75}
                    paddingAngle={8}
                    label={({ name, percent }) => `${name} ${( (percent || 0) * 100).toFixed(0)}%`}
                  >
                    {data.verifiedVsPendingLawyers.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} stroke="none" />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          ))}
        </Grid>
      </Grid>

      {/* Distribution Section */}
      <Grid container spacing={3}>
         <Grid size={{ xs: 12, md: 6 }}>
            {renderCard("Lawyer Regional Distribution", (
              <Box sx={{ height: 350 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.citiesWithMostLawyers} margin={{ bottom: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(var(--color-text-rgb),0.05)" />
                    <XAxis dataKey="city" tick={<MultilineTick />} interval={0} axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(var(--color-text-rgb),0.5)', fontSize: 11 }} />
                    <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                    <Bar dataKey="count" fill="var(--color-primary)" radius={[6, 6, 0, 0]} name="Lawyers" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            ))}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            {renderCard("High-Traffic Courts", (
              <Box sx={{ height: 350 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.courtsWithMostRequests} margin={{ bottom: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(var(--color-text-rgb),0.05)" />
                    <XAxis dataKey="court" tick={<MultilineTick />} interval={0} axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(var(--color-text-rgb),0.5)', fontSize: 11 }} />
                    <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                    <Bar dataKey="count" fill="var(--color-accent)" radius={[6, 6, 0, 0]} name="Help Requests" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            ))}
          </Grid>
      </Grid>

    </Stack>
  );
}
