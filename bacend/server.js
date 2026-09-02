require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./config/database');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();
const port = Number(process.env.PORT || 5000);
const allowedOrigins = [
  process.env.CORS_ORIGIN,
  'http://localhost:8000',
  'https://rd-resource-sharing-portal.netlify.app'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error('Not allowed by CORS'));
  }
}));
app.use(express.json({ limit: '1mb' }));
app.get('/api/health', async (req, res, next) => { try { await pool.query('SELECT 1'); res.json({ success: true, message: "R&D Resource Portal API is running" }); } catch (error) { next(Object.assign(new Error('Database connection unavailable'), { status: 503, cause: error })); } });
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/departments', require('./routes/departmentRoutes'));
app.use('/api/facilities', require('./routes/facilityRoutes'));
app.use('/api/equipment', require('./routes/equipmentRoutes'));
app.use('/api/expertise', require('./routes/expertiseRoutes'));
app.use('/api/requests', require('./routes/requestRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.get('/api/resources/search', require('./controllers/searchController').search);
app.use(notFound);
app.use(errorHandler);

if (require.main === module) app.listen(port, () => console.log(`R&D Resource Portal API listening on http://localhost:${port}`));
module.exports = app;
