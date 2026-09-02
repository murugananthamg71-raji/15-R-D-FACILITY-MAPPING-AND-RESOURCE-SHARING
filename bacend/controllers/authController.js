const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

function normalizeRole(role) {
  const value = String(role || '').trim().toLowerCase();
  if (value === 'technician') return 'lab_technician';
  return value;
}

function publicUser(row) {
  return { id: row.id, name: row.name, email: row.email, role: row.role, department: row.department_code ? { id: row.department_id, code: row.department_code, name: row.department_name } : null };
}
function tokenFor(user) { return jwt.sign({ id: user.id, role: user.role, departmentId: user.department_id }, process.env.JWT_SECRET, { expiresIn: '8h' }); }
const userSelect = `SELECT u.id, u.name, u.email, u.role, u.department_id, d.code AS department_code, d.name AS department_name, u.password_hash FROM users u LEFT JOIN departments d ON d.id = u.department_id`;

async function register(req, res) {
  const { name, email, password, role = 'student', departmentCode } = req.body;
  const normalizedRole = normalizeRole(role);
  if (!name || !/^\S+@\S+\.\S+$/.test(String(email).trim()) || !password || password.length < 6) return res.status(400).json({ success: false, message: 'Name, valid email, and password of at least 6 characters are required' });
  if (!['student', 'faculty', 'lab_technician'].includes(normalizedRole)) return res.status(400).json({ success: false, message: 'Public registration is limited to student, faculty, and lab technician accounts' });
  const hash = await bcrypt.hash(password, 12);
  try {
    const result = await pool.query(`INSERT INTO users (name, email, password_hash, role, department_id) VALUES ($1, $2, $3, $4, (SELECT id FROM departments WHERE code = $5)) RETURNING id`, [name.trim(), email.toLowerCase().trim(), hash, normalizedRole, departmentCode || null]);
    const user = await pool.query(`${userSelect} WHERE u.id = $1`, [result.rows[0].id]);
    res.status(201).json({ success: true, data: { user: publicUser(user.rows[0]), token: tokenFor(user.rows[0]) } });
  } catch (error) {
    if (error.code === '23505') return res.status(409).json({ success: false, message: 'An account with this email already exists' });
    throw error;
  }
}
async function login(req, res) {
  const { email, password, role } = req.body;
  const normalizedRole = normalizeRole(role);
  if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password are required' });
  const result = await pool.query(`${userSelect} WHERE LOWER(u.email) = LOWER($1)${normalizedRole ? ' AND u.role = $2' : ''}`, normalizedRole ? [email.trim(), normalizedRole] : [email.trim()]);
  if (!result.rowCount || !(await bcrypt.compare(password, result.rows[0].password_hash))) return res.status(401).json({ success: false, message: 'Invalid email or password' });
  res.json({ success: true, data: { user: publicUser(result.rows[0]), token: tokenFor(result.rows[0]) } });
}
async function me(req, res) { const result = await pool.query(`${userSelect} WHERE u.id = $1`, [req.user.id]); if (!result.rowCount) return res.status(404).json({ success: false, message: 'User not found' }); res.json({ success: true, data: { user: publicUser(result.rows[0]) } }); }
module.exports = { register, login, me };
