const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const tasksRouter = require('./routes/tasks');
const errorHandler = require('./middleware/errorHandler');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map((url) => url.trim()).filter(Boolean)
  : [];

app.use(express.json());
app.use(cors(allowedOrigins.length ? { origin: allowedOrigins } : {}));
app.use(morgan('tiny'));

app.use('/api/tasks', tasksRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Task approval API listening on http://localhost:${PORT}`);
});
