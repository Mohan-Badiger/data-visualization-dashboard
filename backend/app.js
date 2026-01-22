const express = require('express');
const cors = require('cors');
const insightRoutes = require('./routes/insight.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/insights', insightRoutes);
app.get('/api/filters', insightRoutes.stack.find(r => r.route.path === '/filters').route.stack[0].handle); // Reuse controller logic directly or better mount router
// Actually simplest is to just map it:
// We can't access inner stack easily like that safely.
// Let's just import controller and map it.
const { getFilters } = require('./controllers/insight.controller');
app.get('/api/filters', getFilters);

// Health Check
app.get('/', (req, res) => {
    res.send('API is running...');
});

module.exports = app;
