const express = require('express');
const router = express.Router();
const { getInsights, getFilters } = require('../controllers/insight.controller');

router.get('/', getInsights);
router.get('/filters', getFilters);

module.exports = router;
