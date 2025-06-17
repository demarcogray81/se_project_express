const { SERVER_ERROR } = require("../utils/errors");

module.exports = (err, req, res) => {
  const { statusCode = SERVER_ERROR, message } = err;

  res.status(statusCode).json({
    message:
      statusCode === SERVER_ERROR
        ? "An error has occurred on the server"
        : message,
  });
};
