import data from '../../data/diagnoses';
import { Diagnosis } from '../types';

const getData = (): Diagnosis[] => {
  return data;
};

export default {
  getData
};