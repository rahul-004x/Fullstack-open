import { newDataEntry, Gender, HealthCheckRating, EntryWithoutId, Diagnosis } from "./types";
import { z } from 'zod';

export const NewPatentSchema = z.object({
  name: z.string(),
  ssn: z.string(), 
  dateOfBirth: z.string().date(),
  occupation: z.string(),
  gender: z.nativeEnum(Gender),
  entries: z.array(z.any()).default([])
});

const toNewDataEntry = (object: unknown): newDataEntry => {
  return NewPatentSchema.parse(object);
};

const BaseEntrySchema = z.object({
  description: z.string(),
  date: z.string(),
  specialist: z.string(),
  diagnosisCodes: z.preprocess(val => parseDiagnosisCodes(val), z.array(z.string()).optional()),
});

const HealthCheckSchema = BaseEntrySchema.extend({
  type: z.literal('HealthCheck'),
  healthCheckRating: z.nativeEnum(HealthCheckRating).optional(),
});

const OccupationalSchema = BaseEntrySchema.extend({
  type: z.literal('OccupationalHealthcare'),
  employerName: z.string(),
  sickLeave: z.object({
    startDate: z.string(),
    endDate: z.string()
  }).optional(),
});

const HospitalSchema = BaseEntrySchema.extend({
  type: z.literal('Hospital'),
  discharge: z.object({
    date: z.string(),
    criteria: z.string()
  })
});

export const NewEntrySchema = z.union([
  HealthCheckSchema,
  OccupationalSchema,
  HospitalSchema
]);

const toNewEntry = (object: unknown): EntryWithoutId => {
  return NewEntrySchema.parse(object);
};

const parseDiagnosisCodes = (object: unknown): Array<Diagnosis['code']> =>  {
  if (!object || typeof object !== 'object' || !('diagnosisCodes' in object)) {
    return [] as Array<Diagnosis['code']>;
  }
  return (object as { diagnosisCodes: Array<Diagnosis['code']> }).diagnosisCodes;
};

export default {
  toNewDataEntry,
  toNewEntry
};

// Validation using Type Guards
// const toNewDataEntry = (object: unknown): NewDataEntry => {
//   if (!object || typeof object !== 'object') {
//     throw new Error('Incorrect or missing data');
//   }
//   if ('name' in object && 'ssn' in object && 'dateOfBirth' in object && 'occupation' in object && 'gender' in object) {
//       const newEntry: NewDataEntry = {
//       name: parseName(object.name),
//       ssn: parseSsn(object.ssn),
//       dateOfBirth: parseDOB(object.dateOfBirth),
//       occupation: parseOccupation(object.occupation),
//       gender: parseGender(object.gender),
//     };
//     return newEntry;
//   }
//   throw new Error('Incorrect data: some fields are missing');
// };

// const isString = ( text: unknown): text is string => {
//   return typeof text === 'string' || text instanceof String;
// };

// const parseOccupation = (occupation: unknown): string => {
//   if (!occupation || !isString(occupation)) {
//     throw new Error('Incorrect or missing occupation');
//   };
//   return occupation;
// };

// const isDate = (date: string): boolean => {
//     return Boolean(Date.parse(date));
// };

// const parseDOB = (date: unknown): string => {
//   if (!date || !isString(date) || !isDate(date)) {
//     throw new Error('Incorrect or missing date:' + date);
//   }
//   return date;
// };

// const isGender = (param: string): param is Gender => {
//   return Object.values(Gender).map(v => v.toString()).includes(param);
// };

// const parseName = (name: unknown): string => {
//   if (!name || !isString(name)) {
//     throw new Error('Incorrect or missing name');
//   }
//   return name;
// };

// const parseSsn = (ssn: unknown): string => {
//   if (!ssn || !isString(ssn)) {
//     throw new Error('Incorrect or missing ssn');
//   }
//   return ssn;
// };

// const parseGender = (gender: unknown): Gender => {
//   if (!gender || !isString(gender) || !isGender(gender)) {
//     throw new Error('Incorrect or missing gender');
//   }
//   return gender;
// };