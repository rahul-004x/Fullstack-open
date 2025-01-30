/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import express from 'express';
import { calculateExercises } from './exerciseCalculator';

const app = express();
app.use(express.json());

app.post('/exercises', (req, res) => {
  const { daily_exercises, target }: { daily_exercises: number[], target: number } = req.body;

  if (!daily_exercises || !target) {
    throw new Error('parameter missing');
  }

  const exerciseHours = daily_exercises.map((hours) => {
    if (isNaN(Number(hours))) {
      throw new Error('malformatted parameters');
    }
    return Number(hours);
  });

  const targetValue = Number(target);
  if (isNaN(targetValue)) {
    throw new Error('malformatted parameters');
  }
  const result = calculateExercises(exerciseHours, targetValue);
  res.json(result);
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});