const pool = require('../config/database');

function sanitizeStudent(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    department: row.department_code ? { id: row.department_id, code: row.department_code, name: row.department_name } : null,
    created_at: row.created_at
  };
}

async function list(req, res) {
  if (!req.user || !['faculty', 'lab_technician', 'admin'].includes(req.user.role)) {
    return res.status(403).json({ success: false, message: 'Student records are restricted to faculty and lab technician roles' });
  }

  const result = await pool.query(`
    SELECT u.id, u.name, u.email, u.role, u.department_id, d.code AS department_code, d.name AS department_name, u.created_at
    FROM users u
    LEFT JOIN departments d ON d.id = u.department_id
    WHERE u.role = 'student'
    ORDER BY u.name ASC
  `);

  res.json({ success: true, data: result.rows.map(sanitizeStudent) });
}

async function me(req, res) {
  const result = await pool.query(`
    SELECT u.id, u.name, u.email, u.role, u.department_id, d.code AS department_code, d.name AS department_name, u.created_at
    FROM users u
    LEFT JOIN departments d ON d.id = u.department_id
    WHERE u.id = $1
  `, [req.user.id]);

  if (!result.rowCount) {
    return res.status(404).json({ success: false, message: 'Student not found' });
  }

  res.json({ success: true, data: sanitizeStudent(result.rows[0]) });
}

module.exports = { list, me };