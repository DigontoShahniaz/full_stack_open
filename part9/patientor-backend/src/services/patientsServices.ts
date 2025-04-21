import { v1 as uuid } from 'uuid';
import patients from '../../data/patients';
import { NewPatientEntry, NonSensitivePatientEntry, Patient, Entry, NewEntry } from '../types';

const getEntries = (): Patient[] => {
  return patients.map(patient => ({
    ...patient,
    entries: patient.entries || [],
  }));
};

const getNonSensitiveEntries = (): NonSensitivePatientEntry[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const findById = (id: string): Patient | undefined => {
  const patient = patients.find(p => p.id === id);
  return patient ? { ...patient, entries: patient.entries || [] } : undefined;
};

const addPatient = (entry: NewPatientEntry): Patient => {
  const newPatientEntry = {
    id: uuid(),
    entries: [], 
    ...entry,
  };
  patients.push(newPatientEntry);
  return newPatientEntry;
};

const addEntry = (patientId: string, entry: NewEntry): Entry => {
  const patient = findById(patientId);
  
  if (!patient) {
    throw new Error(`Patient with id ${patientId} not found`);
  }
  
  const newEntry = {
    id: uuid(),
    ...entry
  };
  
  patient.entries.push(newEntry);
  
  return newEntry;
};

export default {
  getEntries,
  getNonSensitiveEntries,
  findById,
  addPatient,
  addEntry
};