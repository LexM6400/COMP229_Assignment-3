export function notFound(request, response, _next) {
  response.status(404).json({ message: `Route not found: ${request.method} ${request.originalUrl}` });
}

export function errorHandler(error, _request, response, _next) {
  let status = error.status || 500;
  if (error.code === 11000) status = 409;
  if (error.name === "ValidationError" || error.name === "CastError") status = 400;
  response.status(status).json({
    message: error.message || "An unexpected server error occurred.",
  });
}
