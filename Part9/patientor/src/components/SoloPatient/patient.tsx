import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Diagnosis, Patient, Entry, HealthCheckRating } from '../../types';
import patientService from '../../services/patients';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import WorkIcon from '@mui/icons-material/Work';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import FavoriteIcon from '@mui/icons-material/Favorite';
import TransgenderIcon from '@mui/icons-material/Transgender';
import { diagnosedService } from '../../services/diagnosis';
import Box from '@mui/system/Box';
import Button from '@mui/material/Button';
import AddEntryModal from '../AddEntryModal';
import { EntryWithoutId } from '../../types';
import axios from 'axios';

const HealthRating = (health: HealthCheckRating) => {
  switch(health) {
    case 0:
      return <FavoriteIcon sx={{ color: 'green' }} />;
    case 1: 
      return <FavoriteIcon sx={{ color: 'yellow' }} />;
    case 2: 
      return <FavoriteIcon sx={{ color: 'blue' }} />;
    case 3: 
      return <FavoriteIcon sx={{ color: 'red' }} />;
  }
};

const assertNever = (value: never): never => {
  throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
};

const HospitalEntryDetails = ({ entry }: { entry: Entry }) => {
  return (
    <>
      {entry.type === "Hospital" && (
        <>
          <p>Discharge date: {entry.discharge.date}</p>
          <p>Criteria: {entry.discharge.criteria}</p>
        </>
      )}
    </>
  );
};

const OccupationalEntryDetails = ({ entry }: { entry: Entry }) => {
  return (
    <>
      {entry.type === "OccupationalHealthcare" && (
        <>
          {entry.sickLeave && (
            <p>Sick leave: {entry.sickLeave.startDate} - {entry.sickLeave.endDate}</p>
          )}
        </>
      )}
    </>
  );
};

const HealthCheckEntryDetails = ({ entry }: { entry: Entry }) => {
  return (
    <>
      {entry.type === "HealthCheck" && (
        <p>{entry.healthCheckRating !== undefined ? HealthRating(entry.healthCheckRating) : null}</p>
      )}
    </>
  );
};

const ExtendedEntryDetails = ({ entry }: { entry: Entry }) => {
  switch (entry.type) {
    case "Hospital":
      return <HospitalEntryDetails entry={entry} />;
    case "OccupationalHealthcare":
      return <OccupationalEntryDetails entry={entry} />;
    case "HealthCheck":
      return <HealthCheckEntryDetails entry={entry} />;
    default:
      return assertNever(entry);
  }
};

const PatientComponent = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [diagnosed, setDiagnosed] = useState<Diagnosis[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

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

  useEffect(() => {
    const fetchPatient = async () => {
      const fetchedPatient = await patientService.findById(id as string);
      setPatient(fetchedPatient);
    };

    const fetchDiagnosis = async () => {
      const fetchedDiagnosis = await diagnosedService.getAll();
      setDiagnosed(fetchedDiagnosis);
    };
    
    void fetchPatient();
    void fetchDiagnosis();
  }, [id]);
  
  const getDiagnosisDescription = (code: string): string => {
    const diagnosis = diagnosed.find(d => d.code === code);
    return diagnosis ? diagnosis.name : code;
  };
  
  const icon = (gender: string) => {
    switch (gender) {
      case 'male':
        return <MaleIcon />;
      case 'female':
        return <FemaleIcon />;
      case 'other':
        return <TransgenderIcon />;
      default:
        return null;
    }
  };

  const getEmployerNameIcon = (employerName: string) => {
    switch (employerName) {
      case 'FBI':
        return <WorkIcon />;
      case 'HyPD':
        return <LocalPoliceIcon />;
      default:
        return <MedicalServicesIcon />;
    }
  };
  
  if (!patient) {
    return <div>Patient not found</div>;
  }

  return (
    <div>
      <h2>{patient.name} {icon(patient.gender)}</h2>
      <p>SSN: {patient.ssn}</p>
      <p>Occupation: {patient.occupation}</p>
      <div>
        <AddEntryModal 
          modalOpen={modalOpen}
          onClose={closeModal}
          onSubmit={submitNewEntry}
          error={error}
          diagnosis={diagnosed}  // <-- Add this
        />
        <h3>entries</h3>
        {(!patient.entries || patient.entries.length === 0) ? (
          <p>No entries found</p>
        ) : (
          patient.entries.map((entry) => (
            <Box sx={{ border: '1px solid grey', borderRadius: 4, padding: 2, margin: 1 }} key={entry.id}>
              <p>{entry.date} {entry.type === "OccupationalHealthcare" && getEmployerNameIcon(entry.employerName)}</p>
              <p>{entry.description}</p>
              {entry.diagnosisCodes && (
                <ul>
                  {entry.diagnosisCodes.map(code => (
                    <li key={code}>
                      {code} {getDiagnosisDescription(code)}
                    </li>
                  ))}
                </ul>
              )}
              <ExtendedEntryDetails entry={entry} />
              <p>diagnosed by {entry.specialist}</p>
            </Box>
          ))
        )}
        <Button variant="contained" onClick={openModal}>
          ADD NEW ENTRY
        </Button>
      </div>
    </div>
  );
};

export default PatientComponent;