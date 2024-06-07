import createError from 'http-errors';

const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  const errors = err.errors || [];

  res.status(status).json({
    status,
    message,
    errors,
  });
};

module.exports = errorHandler;
