// src/app.js
const express = require('express');
const cors = require('cors');
const env = require('./config/env');
const routes = require('./routes');
const notFoundMiddleware = require('./middlewares/notFound.middleware');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

// Configuración de CORS permitiendo múltiples orígenes (local y producción)
app.use(cors({
  origin: [
    'https://verde-vida-ecommerce.vercel.app', 
    'http://localhost:5173',
    env.frontendUrl
  ].filter(Boolean),
  credentials: true
}));

app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'verdevida-backend' }));
app.use('/api', routes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;
