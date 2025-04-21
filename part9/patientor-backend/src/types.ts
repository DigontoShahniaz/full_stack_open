import { z } from 'zod';
import { EntrySchema } from './utils';

export enum Gender {
  male = 'male',
  female = 'female',
  other = 'other',
}

export interface diagnosesEntry {
  code: string;
  name: string;
  latin?: string;
}

interface BaseEntry {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Array<diagnosesEntry['code']>;
}

export enum HealthCheckRating {
  Healthy = 0,
  LowRisk = 1,
  HighRisk = 2,
  CriticalRisk = 3
}

interface HealthCheckEntry extends BaseEntry {
  type: "HealthCheck";
  healthCheckRating: HealthCheckRating;
}

interface HospitalEntry extends BaseEntry {
  type: "Hospital";
  discharge: {
    date: string;
    criteria: string;
  };
}

interface OccupationalHealthcareEntry extends BaseEntry {
  type: "OccupationalHealthcare";
  employerName: string;
  sickLeave?: {
    startDate: string;
    endDate: string;
  };
}

export type Entry =
  | HospitalEntry
  | OccupationalHealthcareEntry
  | HealthCheckEntry;

export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  ssn?: string;
  gender: Gender;
  occupation: string;
  entries: Entry[];
}

export type NewEntry = z.infer<typeof EntrySchema>;

export type NonSensitivePatientEntry = Omit<Patient, 'ssn' | 'entries'>;
export type NonSensitiveDignosesEntry = Omit<diagnosesEntry, 'latin'>;
export type NewPatientEntry = Omit<Patient, 'id' | 'entries'>;
export type PublicPatient = Omit<Patient, 'ssn' | 'entries'>;