const express = require('express');
const otherControllers = require('../controllers/other');

const router = express.Router();


router.post('/following/:id', otherControllers.getFollowings);
router.post('/config', otherControllers.getConfig);
router.put('/config/:id', otherControllers.updateConfig);

module.exports = router;
