import express from 'express';
import patientRouter from './src/routes/patients';
import diagonoseRouter from './src/routes/diagnosis';
import entryRouter from './src/routes/entry';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3001;

app.get('/ping', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});

app.use('/api/patients', patientRouter);
app.use('/api/diagnosed', diagonoseRouter);
app.use('/api/patients', entryRouter); 

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});