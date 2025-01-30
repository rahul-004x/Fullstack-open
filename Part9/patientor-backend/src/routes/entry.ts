import express, { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import dataService from '../services/patientServices';
import { NewEntrySchema } from '../utils';
import { EntryWithoutId, Entry } from '../types';

const router = express.Router();

const newEntryParse = (req: Request, _res: Response, next: NextFunction) => {
  try {
    NewEntrySchema.parse(req.body);
    console.log(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

const errorMiddleware = (error: unknown, _req: Request, res: Response, next: NextFunction) => {
  if (error instanceof z.ZodError) {
    res.status(400).send({ error: error.issues });
  } else {
    next(error);
  }
};

router.get('/:id/entries', (req: Request<{id: string}>, res: Response) => {
  const { id } = req.params;
  const patient = dataService.findById(id);
  if (patient) {
    res.json(patient.entries);
  } else {
    res.status(404).json({ error: 'Patient not found' });
  }
});

router.post('/:id/entries', newEntryParse, (req: Request<{id: string}, unknown, EntryWithoutId>, res: Response<Entry>) => {
  const { id } = req.params;
  const addedEntry = dataService.addEntry(id, req.body);
  res.json(addedEntry);
});

router.use(errorMiddleware);

export default router;