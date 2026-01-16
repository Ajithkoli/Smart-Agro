const express = require('express');
const router = express.Router();
const { ingestData } = require('../controllers/iotController');

router.post('/ingest', ingestData);

module.exports = router;
