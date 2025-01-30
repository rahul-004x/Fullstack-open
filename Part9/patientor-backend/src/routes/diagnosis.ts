import express,{ Response } from 'express';
import dataService from '../services/diagnoseService';
import { Diagnosis } from '../types';

const router = express.Router();

router.get('/', (_req, res: Response<Diagnosis[]> ) => {
  res.send(dataService.getData());
});

export default router;