import { z } from 'zod';
import { NewPatientEntry, Gender, HealthCheckRating } from './types';

const BaseEntrySchema = z.object({
  description: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  specialist: z.string(),
  diagnosisCodes: z.array(z.string()).optional(),
});

const HealthCheckEntrySchema = BaseEntrySchema.extend({
  type: z.literal('HealthCheck'),
  healthCheckRating: z.nativeEnum(HealthCheckRating),
});

const HospitalEntrySchema = BaseEntrySchema.extend({
  type: z.literal('Hospital'),
  discharge: z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    criteria: z.string(),
  }),
});

// Occupational Healthcare Entry Schema
const OccupationalHealthcareEntrySchema = BaseEntrySchema.extend({
  type: z.literal('OccupationalHealthcare'),
  employerName: z.string(),
  sickLeave: z.object({
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  }).optional(),
});

// Combined Entry Schema
export const EntrySchema = z.discriminatedUnion('type', [
  HealthCheckEntrySchema,
  HospitalEntrySchema,
  OccupationalHealthcareEntrySchema,
]);

export const NewEntrySchema = z.object({
  name: z.string(),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  gender: z.nativeEnum(Gender),
  ssn: z.string().optional(),
  occupation: z.string()
});

export const toNewPatientEntry = (object: unknown): NewPatientEntry => {
  return NewEntrySchema.parse(object);
};

export const toNewEntry = (object: unknown) => {
  return EntrySchema.parse(object);
};

export const parseDiagnosisCodes = (object: unknown): Array<string> => {
  if (!object || typeof object !== 'object' || !('diagnosisCodes' in object)) {
    return [] as Array<string>;
  }

  return object.diagnosisCodes as Array<string>;
};

export default toNewPatientEntry;