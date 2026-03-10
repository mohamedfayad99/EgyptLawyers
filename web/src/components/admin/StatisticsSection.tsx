import { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Grid, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Stack, CircularProgress
} from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { api } from '../../api/client';
import StatCard from './StatCard';
import PeopleIcon from '@mui/icons-material/People';

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
  postsTrend: { month: string; count: number }[];
  postsPerCity: { city: string; count: number }[];
  postsPerCourt: { court: string; count: number }[];
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

  const renderCard = (title: string, children: React.ReactNode) => (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        border: '1px solid rgba(var(--color-text-rgb),0.06)',
        bgcolor: 'var(--color-background)',
        height: '100%'
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
        {title}
      </Typography>
      {children}
    </Paper>
  );

  return (
    <Stack spacing={4} sx={{ mt: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: -2 }}>
        Statistics
      </Typography>

      {/* SECTION 1 — Cities Statistics */}
      <Stack spacing={3}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--color-primary)' }}>1. Cities Statistics</Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            {renderCard("Cities with Highest Number of Help Posts", (
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.citiesWithMostPosts} margin={{ bottom: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="city" tick={<MultilineTick />} interval={0} />
                    <YAxis />
                    <RechartsTooltip />
                    <Bar dataKey="count" fill="#8884d8" name="Help Posts" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            ))}
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            {renderCard("Cities with Most Registered Lawyers", (
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.citiesWithMostLawyers} margin={{ bottom: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="city" tick={<MultilineTick />} interval={0} />
                    <YAxis />
                    <RechartsTooltip />
                    <Bar dataKey="count" fill="#82ca9d" name="Lawyers" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            ))}
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            {renderCard("Cities With Activity", (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>City Name</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>Number of Help Posts</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.citiesWithActivity.map((row, i) => (
                      <TableRow key={i}>
                        <TableCell>{row.city}</TableCell>
                        <TableCell align="right">{row.count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ))}
          </Grid>
        </Grid>
      </Stack>

      {/* SECTION 2 — Courts Statistics */}
      <Stack spacing={3}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--color-primary)' }}>2. Courts Statistics</Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            {renderCard("Courts Where Lawyers Request Help the Most", (
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.courtsWithMostRequests} margin={{ bottom: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="court" tick={<MultilineTick />} interval={0} />
                    <YAxis />
                    <RechartsTooltip />
                    <Bar dataKey="count" fill="#ffc658" name="Help Requests" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            ))}
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            {renderCard("Number of Courts Per City", (
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.courtsPerCity} margin={{ bottom: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="city" tick={<MultilineTick />} interval={0} />
                    <YAxis />
                    <RechartsTooltip />
                    <Bar dataKey="count" fill="#8884d8" name="Courts" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            ))}
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            {renderCard("Courts With Requests", (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Court Name</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>City</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>Number of Help Requests</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.courtsWithRequests.map((row, i) => (
                      <TableRow key={i}>
                        <TableCell>{row.court}</TableCell>
                        <TableCell>{row.city}</TableCell>
                        <TableCell align="right">{row.count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ))}
          </Grid>
        </Grid>
      </Stack>

      {/* SECTION 3 — Lawyers Statistics */}
      <Stack spacing={3}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--color-primary)' }}>3. Lawyers Statistics</Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            {renderCard("Verified vs Pending Lawyers", (
              <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.verifiedVsPendingLawyers}
                      dataKey="count"
                      nameKey="status"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {data.verifiedVsPendingLawyers.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            ))}
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Stack spacing={3} sx={{ height: '100%' }}>
              <StatCard
                title="Lawyers Who Created Posts"
                value={data.activeLawyersCreators}
                icon={PeopleIcon}
                color="var(--color-primary)"
              />
              <StatCard
                title="Lawyers Who Replied to Posts"
                value={data.activeLawyersRepliers}
                icon={PeopleIcon}
                color="var(--color-accent)"
              />
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            {renderCard("Top Contributing Lawyers", (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Lawyer Name</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>Number of Replies</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.topContributingLawyers.map((row, i) => (
                      <TableRow key={i}>
                        <TableCell>{row.lawyer}</TableCell>
                        <TableCell align="right">{row.count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ))}
          </Grid>
        </Grid>
      </Stack>

      {/* SECTION 4 — Posts Statistics */}
      <Stack spacing={3}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--color-primary)' }}>4. Posts Statistics</Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            {renderCard("Posts Trend", (
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.postsTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <RechartsTooltip />
                    <Line type="monotone" dataKey="count" stroke="#8884d8" name="Help Posts" />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            ))}
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            {renderCard("Posts Per City", (
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.postsPerCity} margin={{ bottom: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="city" tick={<MultilineTick />} interval={0} />
                    <YAxis />
                    <RechartsTooltip />
                    <Bar dataKey="count" fill="#82ca9d" name="Posts" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            ))}
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            {renderCard("Posts Per Court", (
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.postsPerCourt} margin={{ bottom: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="court" tick={<MultilineTick />} interval={0} />
                    <YAxis />
                    <RechartsTooltip />
                    <Bar dataKey="count" fill="#ffc658" name="Posts" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            ))}
          </Grid>
        </Grid>
      </Stack>
    </Stack>
  );
}
