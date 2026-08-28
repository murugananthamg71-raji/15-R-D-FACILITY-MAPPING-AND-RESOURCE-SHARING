function notFound(req, res) {
  res.status(404).json({ success: false, message: 'Route not found' });
}

function errorHandler(error, req, res, next) {
  console.error(error);
  if (res.headersSent) return next(error);
  const status = error.status || (error.code === '23505' ? 409 : 500);
  const message = error.code === '23505' ? 'A record with that value already exists' : error.message || 'Internal server error';
  res.status(status).json({ success: false, message });
}

module.exports = { notFound, errorHandler };
