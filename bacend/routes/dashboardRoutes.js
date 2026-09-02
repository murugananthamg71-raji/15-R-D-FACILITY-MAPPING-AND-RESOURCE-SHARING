const router = require('express').Router();
const pool = require('../config/database');
const controller = require('../controllers/dashboardController');
const authenticate = require('../middleware/authMiddleware');
const requireRoles = require('../middleware/roleMiddleware');

router.get('/stats', authenticate, controller.stats);

router.get('/faculty', authenticate, requireRoles('faculty'), async (req, res) => {
  try {
    const [students, stats] = await Promise.all([
      pool.query(`SELECT u.id, u.name, u.email, u.role, u.department_id, d.code AS department_code, d.name AS department_name, u.created_at FROM users u LEFT JOIN departments d ON d.id = u.department_id WHERE u.role = 'student' ORDER BY u.name ASC`),
      pool.query(`SELECT (SELECT COUNT(*) FROM departments) AS departments, (SELECT COUNT(*) FROM facilities) AS facilities, (SELECT COUNT(*) FROM equipment) AS equipment, (SELECT COUNT(*) FROM expertise) AS experts, (SELECT COUNT(*) FROM resource_requests WHERE status = 'Pending') AS pendingRequests, (SELECT COUNT(*) FROM resource_requests WHERE status = 'Approved') AS approvedRequests, (SELECT COUNT(*) FROM resource_requests WHERE status = 'Rejected') AS rejectedRequests`)
    ]);
    const response = Object.fromEntries(Object.entries(stats.rows[0]).map(([key, value]) => [key, Number(value)]));
    return res.json({ success: true, data: { stats: response, students: students.rows } });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Faculty dashboard unavailable' });
  }
});

router.get('/lab-technician', authenticate, requireRoles('lab_technician'), async (req, res) => {
  try {
    const [students, equipment, facilities] = await Promise.all([
      pool.query(`SELECT u.id, u.name, u.email, u.role, u.department_id, d.code AS department_code, d.name AS department_name, u.created_at FROM users u LEFT JOIN departments d ON d.id = u.department_id WHERE u.role = 'student' ORDER BY u.name ASC`),
      pool.query(`SELECT COUNT(*) FROM equipment`),
      pool.query(`SELECT COUNT(*) FROM facilities`)
    ]);
    return res.json({ success: true, data: { students: students.rows, equipmentCount: Number(equipment.rows[0].count), facilitiesCount: Number(facilities.rows[0].count) } });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Lab technician dashboard unavailable' });
  }
});

module.exports = router;
