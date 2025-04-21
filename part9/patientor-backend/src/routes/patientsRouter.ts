import express, { Request, Response, NextFunction } from 'express';
import patientsServices from '../services/patientsServices';
import { NewEntrySchema, EntrySchema } from '../utils';
import { NewPatientEntry, NonSensitivePatientEntry, NewEntry } from '../types';
import z from 'zod';

const router = express.Router();

router.get('/', (_req, res: Response<NonSensitivePatientEntry[]>) => {
  res.send(patientsServices.getNonSensitiveEntries());
});

router.get('/:id', (req, res) => {
  const patient = patientsServices.findById(req.params.id);

  if (patient) {
    res.send(patient);
  } else {
    res.sendStatus(404);
  }
});

const newPatientParser = (req: Request, _res: Response, next: NextFunction) => { 
  try {
    NewEntrySchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

const newEntryParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    EntrySchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

const errorMiddleware = (error: unknown, _req: Request, res: Response, next: NextFunction) => { 
  if (error instanceof z.ZodError) {
    res.status(400).send({ error: error.issues });
  } else if (error instanceof Error) {
    res.status(400).send({ error: error.message });
  } else {
    next(error);
  }
};

router.post('/', newPatientParser, (req: Request<unknown, unknown, NewPatientEntry>, res: Response) => {
  const addedEntry = patientsServices.addPatient(req.body);
  res.json(addedEntry);
});

// New endpoint for adding entries to a patient
router.post('/:id/entries', newEntryParser, (req: Request<{ id: string }, unknown, NewEntry>, res: Response) => {
  try {
    const addedEntry = patientsServices.addEntry(req.params.id, req.body);
    res.json(addedEntry);
  } catch (error) {
    if (error instanceof Error) {
      res.status(404).send({ error: error.message });
    } else {
      res.status(400).send({ error: 'Unknown error' });
    }
  }
});

router.use(errorMiddleware);

export default router;