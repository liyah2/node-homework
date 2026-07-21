function errorHandler(err, req, res, next) {
  return res.status(500).json({
    error: "Internal server error.",
  });
}

module.exports = errorHandler;
