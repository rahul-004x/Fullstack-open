import express, { NextFunction } from 'express';
import { Response, Request } from 'express';
import dataServices from '../services/patientServices';
import  { NewPatentSchema }  from '../utils';
import { NewDataEntry, NonSensitivePatientEntry, PatientEntry } from '../types';
import { z } from 'zod';

const router = express.Router();

router.get('/', (_req, res: Response<NonSensitivePatientEntry[]>) => {
  res.send(dataServices.getNonSensitiveData());
});

const newPatientParse = (req: Request, _res: Response, next: NextFunction) => {
  try{
    NewPatentSchema.parse(req.body);
    console.log(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};  

const errorMiddleware = (error: unknown, _req: Request, res: Response, next: NextFunction) => {
  if (error instanceof z.ZodError) {
    res.status(400).send({error: error.issues});
  } else {
    next(error);
  }
};

router.post('/', newPatientParse, (req: Request<unknown, unknown, NewDataEntry>, res: Response<PatientEntry>) => {
  const addedPatient = dataServices.addPatient({ ...req.body, entries: [] });
  res.json(addedPatient);
});

router.get('/:id', (req: Request, res: Response<PatientEntry | string>) => {
  const entry = dataServices.findById(String(req.params.id));
  if (entry) {
    res.send(entry);
  } else {
    res.status(400).send('Patient not found');
  }
});

router.use(errorMiddleware);

export default router;