import React, { useState, useMemo } from 'react';
import { 
  Grid, 
  Paper, 
  Typography, 
  Box,
  Card,
  CardContent,
  Stack,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
  Alert
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Person as PersonIcon,
  MedicalServices as MedicalServicesIcon,
  LocalHospital as LocalHospitalIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  ArcElement,
  BarElement,
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { Patient, Gender } from '../../types';
import { useNavigate } from 'react-router-dom';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  ChartTooltip,
  Legend
);

interface DashboardProps {
  patients: Patient[];
}

interface StatCard {
  title: string;
  value: number | string;
  icon: JSX.Element;
  color: string;
  trend?: string;
  trendValue?: string;
}

const formatNumber = (num: number): string => {
  return num.toLocaleString();
};

const Dashboard: React.FC<DashboardProps> = ({ patients }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const theme = useTheme();

  // Memoized calculations
  const {
    totalPatients,
    activePatients,
    totalEntries,
    recentEntries,
    genderDistribution,
    entryTypes
  } = useMemo(() => {
    const now = new Date();
    const timeRanges = {
      week: new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000)),
      month: new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000)),
      year: new Date(now.getTime() - (365 * 24 * 60 * 60 * 1000))
    };
    const rangeStart = timeRanges[selectedTimeRange];

    // Calculate total entries and active patients
    let totalEntriesCount = 0;
    let activePatientsCount = 0;
    const entryTypesCount: Record<string, number> = {};
    
    patients.forEach(patient => {
      if (patient.entries && patient.entries.length > 0) {
        totalEntriesCount += patient.entries.length;
        
        // Only count entries within selected time range for active status
        const entriesInRange = patient.entries.filter(entry => 
          new Date(entry.date) >= rangeStart
        );
        
        if (entriesInRange.length > 0) {
          activePatientsCount++;
        }

        // Count all entry types
        patient.entries.forEach(entry => {
          entryTypesCount[entry.type] = (entryTypesCount[entry.type] || 0) + 1;
        });
      }
    });

    // Get gender distribution
    const genders = {
      male: patients.filter(p => p.gender === Gender.Male).length,
      female: patients.filter(p => p.gender === Gender.Female).length,
      other: patients.filter(p => p.gender === Gender.Other).length,
    };

    // Get all entries with patient info (for navigation)
    const allRecentEntries = patients
      .flatMap(p => (p.entries || []).map(entry => ({ 
        ...entry, 
        patientId: p.id,
        patientName: p.name
      })))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);

    return {
      totalPatients: patients.length,
      activePatients: activePatientsCount,
      totalEntries: totalEntriesCount,
      recentEntries: allRecentEntries,
      genderDistribution: genders,
      entryTypes: entryTypesCount
    };
  }, [patients, selectedTimeRange]);

  const statsCards: StatCard[] = [
    {
      title: 'Total Patients',
      value: formatNumber(totalPatients),
      icon: <PersonIcon />,
      color: theme.palette.primary.main,
      trend: 'up',
      trendValue: '+5% this month'
    },
    {
      title: 'Active Patients',
      value: formatNumber(activePatients),
      icon: <MedicalServicesIcon />,
      color: theme.palette.success.main,
      trend: 'up',
      trendValue: `${totalPatients > 0 ? Math.round((activePatients/totalPatients) * 100) : 0}% of total`
    },
    {
      title: 'Total Entries',
      value: formatNumber(totalEntries),
      icon: <LocalHospitalIcon />,
      color: theme.palette.warning.main,
      trend: 'up',
      trendValue: `Avg. ${totalPatients > 0 ? (totalEntries / totalPatients).toFixed(1) : 0} per patient`
    }
  ];

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleTimeRangeChange = (range: 'week' | 'month' | 'year') => {
    setSelectedTimeRange(range);
    setAnchorEl(null);
  };

  // Chart data
  const genderChartData = {
    labels: ['Male', 'Female', 'Other'],
    datasets: [
      {
        data: [
          genderDistribution.male,
          genderDistribution.female,
          genderDistribution.other
        ],
        backgroundColor: [
          theme.palette.primary.main,
          theme.palette.secondary.main,
          theme.palette.warning.main
        ],
        borderWidth: 0,
      },
    ],
  };

  const entryTypeChartData = {
    labels: Object.keys(entryTypes),
    datasets: [
      {
        label: 'Entry Types',
        data: Object.values(entryTypes),
        backgroundColor: [
          theme.palette.success.main,
          theme.palette.primary.main,
          theme.palette.secondary.main
        ],
      },
    ],
  };

  // Monthly trends data
  const monthlyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'New Patients',
        data: [12, 19, 15, 25, 22, totalPatients],
        borderColor: theme.palette.primary.main,
        tension: 0.4,
        fill: false,
      },
      {
        label: 'Entries',
        data: [30, 45, 32, 60, 55, totalEntries],
        borderColor: theme.palette.success.main,
        tension: 0.4,
        fill: false,
      },
    ],
  };

  if (!patients.length) {
    return (
      <Alert severity="info" sx={{ m: 2 }}>
        Loading dashboard data...
      </Alert>
    );
  }

  return (
    <Box sx={{ width: '100%', p: { xs: 1, sm: 2, md: 3 } }}>
      <Typography variant="h5" gutterBottom>
        Dashboard
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Stats Cards - 3 cards (removed top occupation) */}
        {statsCards.map((stat, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 3,
                height: '100%',
                bgcolor: 'white',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'grey.200',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[4],
                }
              }}
            >
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box
                    sx={{
                      bgcolor: stat.color + '15',
                      p: 1,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {React.cloneElement(stat.icon, { sx: { color: stat.color } })}
                  </Box>
                  <Typography color="text.secondary" variant="body2">
                    {stat.title}
                  </Typography>
                </Box>
                <Typography variant="h4" component="div">
                  {stat.value}
                </Typography>
                {stat.trend && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TrendingUpIcon sx={{ color: 'success.main', fontSize: '1rem' }} />
                    <Typography variant="caption" color="success.main">
                      {stat.trendValue}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Top row - full width for trends chart */}
        <Grid item xs={12}>
          <Paper 
            sx={{ 
              p: 3,
              height: 400,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'grey.200'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6">Patient Activity Trends</Typography>
              <Box>
                <IconButton onClick={handleClick} size="small">
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={() => handleTimeRangeChange('week')}>Last Week</MenuItem>
                  <MenuItem onClick={() => handleTimeRangeChange('month')}>Last Month</MenuItem>
                  <MenuItem onClick={() => handleTimeRangeChange('year')}>Last Year</MenuItem>
                </Menu>
              </Box>
            </Box>
            <Line 
              data={monthlyData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      display: true,
                      color: theme.palette.grey[100]
                    }
                  },
                  x: {
                    grid: {
                      display: false
                    }
                  }
                }
              }} 
            />
          </Paper>
        </Grid>

        {/* Middle row - split into two equal columns */}
        <Grid item xs={12} md={6}>
          <Paper 
            sx={{ 
              p: 3,
              height: 350,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'grey.200'
            }}
          >
            <Typography variant="h6" gutterBottom>
              Patient Demographics
            </Typography>
            <Box sx={{ height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Doughnut 
                data={genderChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                  },
                }}
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper 
            sx={{ 
              p: 3,
              height: 350,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'grey.200'
            }}
          >
            <Typography variant="h6" gutterBottom>
              Entry Types Distribution
            </Typography>
            <Box sx={{ height: 280 }}>
              <Bar 
                data={entryTypeChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        display: true,
                        color: theme.palette.grey[100]
                      }
                    },
                    x: {
                      grid: {
                        display: false
                      }
                    }
                  }
                }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Bottom row - full width for recent entries */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'grey.200' }}>
            <Typography variant="h6" gutterBottom>
              Recent Medical Entries
            </Typography>
            {recentEntries.length === 0 ? (
              <Alert severity="info" sx={{ mt: 2 }}>
                No medical entries found
              </Alert>
            ) : (
              <Grid container spacing={2}>
                {recentEntries.map((entry: any) => (
                  <Grid item xs={12} key={entry.id}>
                    <Card 
                      variant="outlined"
                      sx={{ 
                        '&:hover': { 
                          bgcolor: 'action.hover',
                          cursor: 'pointer',
                          transform: 'translateY(-2px)',
                          boxShadow: 1
                        },
                        border: '1px solid',
                        borderColor: 'grey.200',
                        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                      }}
                      onClick={() => {
                        if (entry.patientId) {
                          navigate(`/patients/${entry.patientId}`);
                        }
                      }}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box>
                            <Typography variant="subtitle1" color="primary">
                              {entry.patientName && `Patient: ${entry.patientName}`}
                            </Typography>
                            <Typography variant="subtitle2">
                              {entry.date}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                              {entry.description.length > 100 
                                ? entry.description.substring(0, 100) + '...'
                                : entry.description}
                            </Typography>
                          </Box>
                          <Chip 
                            label={entry.type} 
                            size="small"
                            color={
                              entry.type === 'Hospital' ? 'error' :
                              entry.type === 'HealthCheck' ? 'primary' :
                              'success'
                            }
                            sx={{ mt: 1 }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
