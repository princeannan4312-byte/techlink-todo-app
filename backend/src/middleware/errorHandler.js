export const errorHandler = (err, req, res, next) => {
  console.error(`Error on ${req.method} ${req.url}:`, err.message || err);
  const status = err.status || 500;
  const message = status === 500 ? 'Internal server error' : (err.message || 'Something went wrong');
  res.status(status).json({ error: message });
};
