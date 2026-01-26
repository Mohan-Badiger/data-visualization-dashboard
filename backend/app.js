const express = require('express');
const cors = require('cors');
const insightRoutes = require('./routes/insight.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/insights', insightRoutes);

const { getFilters } = require('./controllers/insight.controller');
app.get('/api/filters', getFilters);

// Health Check
app.get('/', (req, res) => {
    res.send('API is running...');
});

module.exports = app;
