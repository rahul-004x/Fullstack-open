import { z } from 'zod';
import { NewPatentSchema } from './utils';

export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other'
}

export enum HealthCheckRating {
  "Healthy" = 0,
  "LowRisk" = 1,
  "HignRisk" = 2,
  "CriticalRisk" = 3
}

export interface BaseEntry {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Array<Diagnosis['code']>;
}

export interface HealthCheckEntry extends BaseEntry {
  type: 'HealthCheck';
  healthCheckRating?: HealthCheckRating;
}

export interface OccupationalHealthCareEntry extends BaseEntry {
  type: 'OccupationalHealthcare';
  employerName: string;
  sickLeave?: {
    startDate: string;
    endDate: string;
  };
};

export interface Hospital extends BaseEntry {
  type: 'Hospital';
  discharge: {
    date: string;
    criteria: string;
  }
}

export type Entry = HealthCheckEntry | OccupationalHealthCareEntry | Hospital;

export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

export interface PatientEntry {
  id: string;
  name: string;
  dateOfBirth: string;
  ssn: string;
  gender: Gender;
  occupation: string;
  entries: Entry[]
}

export type NewDataEntry = z.infer<typeof NewPatentSchema>; 
export type NonSensitivePatientEntry = Omit<PatientEntry, 'ssn' | 'entries'>; 
export type newDataEntry = Omit<PatientEntry, 'id'>;

// Define special omit for unions
export type UnionOmit<T, K extends string | number | symbol> = T extends unknown ? Omit<T, K> : never;
// Define Entry without the 'id' property
export type EntryWithoutId = UnionOmit<Entry, 'id'>;