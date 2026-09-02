const express = require('express');
const student = require('../controllers/studentController');
const authenticate = require('../middleware/authMiddleware');
const requireRoles = require('../middleware/roleMiddleware');

const router = express.Router();
router.use(authenticate);
router.get('/', requireRoles('faculty', 'lab_technician', 'admin'), student.list);
router.get('/me', student.me);

module.exports = router;
