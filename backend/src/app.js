// src/app.js
const express = require('express');
const cors = require('cors');
const env = require('./config/env');
const routes = require('./routes');
const notFoundMiddleware = require('./middlewares/notFound.middleware');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

app.use(cors({ origin: env.frontendUrl }));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'verdevida-backend' }));
app.use('/api', routes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;
