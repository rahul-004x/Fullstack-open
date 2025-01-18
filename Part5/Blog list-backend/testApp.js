const express = require('express');
const mongoose = require('mongoose');
const logger = require('./utils/logger');
require('dotenv').config();

const testloginRouter = require('./controllers/testlogin'); 

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

mongoose.set('strictQuery', false);

logger.info('connecting to', process.env.TEST_MONGODB_URI);

mongoose.connect(process.env.TEST_MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message);
  });

// Use the login router
app.use('/api/testlogin', testloginRouter);

const PORT = 3002;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
