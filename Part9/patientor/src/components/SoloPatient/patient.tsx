import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Diagnosis, 
  Patient, 
  Entry, 
  HealthCheckRating 
} from '../../types';
import patientService from '../../services/patients';
import { 
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Chip,
  Button,
  IconButton,
  Divider,
  Alert,
  AlertTitle,
  Paper,
  Avatar,
  Tooltip,
  Badge,
  Fade,
  useTheme,
  Container,
  Stack
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent
} from '@mui/lab';
import {
  Male as MaleIcon,
  Female as FemaleIcon,
  Work as WorkIcon,
  MedicalServices as MedicalServicesIcon,
  LocalPolice as LocalPoliceIcon,
  Favorite as FavoriteIcon,
  Transgender as TransgenderIcon,
  ArrowBack as ArrowBackIcon,
  CalendarMonth as CalendarMonthIcon,
  AssignmentInd as AssignmentIndIcon,
  Add as AddIcon,
  Article as ArticleIcon
} from '@mui/icons-material';
import { diagnosedService } from '../../services/diagnosis';
import AddEntryModal from '../AddEntryModal';
import { EntryWithoutId } from '../../types';
import axios from 'axios';

const HealthRating = (health: HealthCheckRating) => {
  const colors: Record<HealthCheckRating, "success" | "info" | "warning" | "error"> = {
    [HealthCheckRating.Healthy]: 'success',
    [HealthCheckRating.LowRisk]: 'info',
    [HealthCheckRating.HighRisk]: 'warning',
    [HealthCheckRating.CriticalRisk]: 'error'
  };
  return <FavoriteIcon color={colors[health]} />;
};

const assertNever = (value: never): never => {
  throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
};

const EntryDetails = ({ entry }: { entry: Entry }) => {
  const theme = useTheme();
  
  const baseStyles = {
    p: 3,
    mb: 2,
    borderRadius: 2,
    boxShadow: 2,
    position: 'relative',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      transform: 'translateX(8px)',
      boxShadow: 3,
    },
    className: "patient-entry"
  };

  const getEntryColor = (type: string) => {
    switch(type) {
      case 'Hospital':
        return theme.palette.error.light;
      case 'OccupationalHealthcare':
        return theme.palette.success.light;
      case 'HealthCheck':
        return theme.palette.info.light;
      default:
        return theme.palette.background.paper;
    }
  };

  const commonContent = (
    <>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {entry.date}
      </Typography>
      <Typography variant="body1" gutterBottom>
        {entry.description}
      </Typography>
      {entry.diagnosisCodes && entry.diagnosisCodes.length > 0 && (
        <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {entry.diagnosisCodes.map(code => (
            <Chip 
              key={code}
              label={code}
              size="small"
              className="diagnosis-chip"
            />
          ))}
        </Box>
      )}
    </>
  );

  switch (entry.type) {
    case "Hospital":
      return (
        <Paper sx={{ ...baseStyles, bgcolor: getEntryColor('Hospital') }}>
          <Typography variant="h6" gutterBottom>
            <MedicalServicesIcon sx={{ mr: 1 }} />
            Hospital Visit
          </Typography>
          {commonContent}
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2">Discharge</Typography>
            <Typography variant="body2">Date: {entry.discharge.date}</Typography>
            <Typography variant="body2">Criteria: {entry.discharge.criteria}</Typography>
          </Box>
        </Paper>
      );
    case "OccupationalHealthcare":
      return (
        <Paper sx={{ ...baseStyles, bgcolor: getEntryColor('OccupationalHealthcare') }}>
          <Typography variant="h6" gutterBottom>
            <WorkIcon sx={{ mr: 1 }} />
            Occupational Healthcare - {entry.employerName}
          </Typography>
          {commonContent}
          {entry.sickLeave && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2">Sick Leave</Typography>
              <Typography variant="body2">
                From: {entry.sickLeave.startDate} to {entry.sickLeave.endDate}
              </Typography>
            </Box>
          )}
        </Paper>
      );
    case "HealthCheck":
      return (
        <Paper sx={{ ...baseStyles, bgcolor: getEntryColor('HealthCheck') }}>
          <Typography variant="h6" gutterBottom>
            <LocalPoliceIcon sx={{ mr: 1 }} />
            Health Check
          </Typography>
          {commonContent}
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2">Health Rating</Typography>
            {entry.healthCheckRating !== undefined && (
              <Box sx={{ mt: 1 }}>
                {HealthRating(entry.healthCheckRating)}
              </Box>
            )}
          </Box>
        </Paper>
      );
    default:
      return assertNever(entry);
  }
};

const PatientComponent = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [diagnosed, setDiagnosed] = useState<Diagnosis[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const openModal = (): void => setModalOpen(true);
  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const fetchedPatient = await patientService.findById(id as string);
        setPatient(fetchedPatient);
      } catch (error) {
        console.error("Error fetching patient:", error);
        setError("Failed to load patient data");
      }
    };

    const fetchDiagnosis = async () => {
      try {
        const fetchedDiagnosis = await diagnosedService.getAll();
        setDiagnosed(fetchedDiagnosis);
      } catch (error) {
        console.error("Error fetching diagnoses:", error);
      }
    };
    
    void fetchPatient();
    void fetchDiagnosis();
  }, [id]);

  const submitNewEntry = async (values: EntryWithoutId) => {
    try {
      const entry = await patientService.createEntry(id as string, values);
      const updatedPatient = { ...patient, entries: [...(patient?.entries || []), entry] } as Patient;
      setPatient(updatedPatient);
      setModalOpen(false);
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        if (e?.response?.data && typeof e?.response?.data === "string") {
          const message = e.response.data.replace('Something went wrong. Error: ', '');
          console.error(message);
          setError(message);
        } else {
          setError("Unrecognized axios error");
        }
      } else {
        console.error("Unknown error", e);
        setError("Unknown error");
      }
    }
  };

  const getStatusColor = (entriesCount: number): "info" | "warning" | "success" => {
    if (entriesCount === 0) return 'info';
    if (entriesCount < 3) return 'warning';
    return 'success';
  };

  if (!patient) {
    return <Alert severity="info">Loading patient data...</Alert>;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Tooltip title="Return to patient list">
          <IconButton 
            onClick={() => navigate(-1)} 
            aria-label="back to patient list"
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
        </Tooltip>
        <Typography variant="h4" component="h1">Patient Details</Typography>
      </Box>

      <Card 
        sx={{ 
          mb: 4,
          borderRadius: 2,
          boxShadow: (theme) => theme.shadows[3]
        }}
        component="section"
        aria-label="Patient information"
      >
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar 
                  sx={{ 
                    width: 64, 
                    height: 64, 
                    bgcolor: (theme) => theme.palette.primary.main,
                    mr: 2 
                  }}
                >
                  {patient.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography 
                    variant="h4" 
                    component="h2"
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      mb: 1 
                    }}
                  >
                    {patient.name}
                    <Tooltip title={`Gender: ${patient.gender}`}>
                      <Box component="span" sx={{ ml: 1 }}>
                        {patient.gender === 'male' && <MaleIcon color="info" />}
                        {patient.gender === 'female' && <FemaleIcon color="info" />}
                        {patient.gender === 'other' && <TransgenderIcon color="info" />}
                      </Box>
                    </Tooltip>
                  </Typography>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Chip 
                      icon={<AssignmentIndIcon />}
                      label={`SSN: ${patient.ssn}`}
                      variant="outlined"
                      sx={{ borderRadius: 1 }}
                    />
                    <Chip 
                      icon={<WorkIcon />}
                      label={patient.occupation}
                      variant="outlined"
                      sx={{ borderRadius: 1 }}
                    />
                  </Stack>
                </Box>
              </Box>
            </Grid>
            <Grid 
              item 
              xs={12} 
              md={4} 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: { xs: 'flex-start', md: 'flex-end' },
                justifyContent: 'center'
              }}
            >
              <Badge 
                badgeContent={patient.entries?.length || 0} 
                color={getStatusColor(patient.entries?.length || 0)}
                sx={{ mb: 2 }}
              >
                <Typography variant="h6" component="span">
                  Medical Records
                </Typography>
              </Badge>
              <Button 
                variant="contained" 
                onClick={openModal}
                startIcon={<AddIcon />}
                size="large"
                aria-label="Add new medical entry"
              >
                Add New Entry
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Box component="section" aria-label="Medical history">
        <Typography 
          variant="h5" 
          component="h2" 
          gutterBottom
          sx={{
            display: 'flex',
            alignItems: 'center',
            '&::before': {
              content: '""',
              width: 4,
              height: 24,
              backgroundColor: 'primary.main',
              marginRight: 2,
              borderRadius: 1
            }
          }}
        >
          Medical History
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {patient.entries && patient.entries.length > 0 ? (
          <Timeline 
            sx={{ 
              p: 0,
              [`& .MuiTimelineItem-root:before`]: {
                flex: 0
              }
            }}
          >
            {patient.entries.map((entry, index) => (
              <TimelineItem key={entry.id}>
                <TimelineOppositeContent 
                  sx={{ flex: 0.2 }}
                  aria-label="Entry date"
                >
                  <Typography variant="body2" color="text.secondary">
                    {new Date(entry.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </Typography>
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot 
                    color={index === 0 ? "primary" : "grey"} 
                    variant={index === 0 ? "filled" : "outlined"}
                  />
                  {index !== patient.entries.length - 1 && (
                    <TimelineConnector sx={{ height: 60 }} />
                  )}
                </TimelineSeparator>
                <TimelineContent sx={{ py: '12px', px: 2 }}>
                  <Fade in timeout={300} style={{ transitionDelay: `${index * 100}ms` }}>
                    <Box>
                      <EntryDetails entry={entry} />
                    </Box>
                  </Fade>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        ) : (
          <Alert 
            severity="info"
            sx={{ 
              borderRadius: 2,
              '& .MuiAlert-icon': {
                fontSize: '2rem'
              }
            }}
          >
            <AlertTitle>No Records</AlertTitle>
            No medical entries found for this patient. Add a new entry to start the medical record.
          </Alert>
        )}
      </Box>

      <AddEntryModal 
        modalOpen={modalOpen}
        onClose={closeModal}
        onSubmit={submitNewEntry}
        error={error}
        diagnosis={diagnosed}
      />
    </Container>
  );
};

export default PatientComponent;