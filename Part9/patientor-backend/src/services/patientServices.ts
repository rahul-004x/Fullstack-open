import data from '../../data/patients';
import patients from '../../data/patients-full';
import { v1 as uuid } from 'uuid';

import { Entry, EntryWithoutId, NonSensitivePatientEntry, PatientEntry, newDataEntry } from '../types';

const getData = () : PatientEntry[] => {
  return data;
};

const getNonSensitiveData = () : NonSensitivePatientEntry[] => {
  return data.map(({id, name, dateOfBirth, occupation, gender}) => ({
    id,
    name,
    dateOfBirth,
    occupation,
    gender
  }));
};

const addPatient = (entry: newDataEntry): PatientEntry => {
  const id = uuid();
  const newPatientEntry = {
    id,
    ...entry
  };
  data.push(newPatientEntry);
  return newPatientEntry;
};

const findById = (id: string): PatientEntry | undefined => {
  const entry = patients.find(d => d.id === id);
  return entry;
};

const addEntry = (patientId: string, entry: EntryWithoutId): Entry => {
  const id = uuid();
  const newEntry = {
    id,
    ...entry
  };

  const patient = data.find(p => p.id === patientId);
  const patientFull = patients.find(p => p.id === patientId);

  if (!patient || !patientFull) {
    throw new Error('Patient not found');
  }
  
  patient.entries = patient.entries || [];
  patientFull.entries = patientFull.entries || [];

  patient.entries.push(newEntry);
  patientFull.entries.push(newEntry);
  
  return newEntry;
};

export default {
  getData,
  addPatient,
  addEntry,
  getNonSensitiveData,
  findById,
};