const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const createHttpError = require('http-errors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

if (!process.env.JWT_SECRET) {
  console.error("❌ ERROR: JWT_SECRET is missing in .env file!");
  process.exit(1);
}

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsing with size limit
app.use(bodyParser.json({ limit: '10kb' }));


app.get('/', (req, res) => {
  res.json({ status: 'API operational', timestamp: new Date() });
});

// Error handling middleware (must be last)
app.use((err, req, res, next) => {
  console.error("❌ API Error:", err.message);
  if (err instanceof createHttpError.HttpError) {
    return res.status(err.statusCode).json({
      error: err.message,
      details: err.details,
    });
  }
  res.status(500).json({ error: 'Internal Server Error' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
