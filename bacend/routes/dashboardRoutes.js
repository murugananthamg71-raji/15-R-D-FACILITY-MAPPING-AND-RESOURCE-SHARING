const router = require('express').Router(); const controller = require('../controllers/dashboardController'); const authenticate = require('../middleware/authMiddleware');
router.get('/stats', authenticate, controller.stats); module.exports = router;
