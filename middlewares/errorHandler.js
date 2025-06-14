const { SERVER_ERROR } = require("../utils/errors");

module.exports = (err, req, res, next) => {
  const { statusCode = SERVER_ERROR, message } = err;

  console.error(
    `Error ${err.name || "UnknownError"} - ${
      err.message || "No message provided"
    }`
  );
  if (!err.name || !err.message) {
    console.error("Unexpected error format:", err);
  }

  res.status(statusCode).send({
    message:
      statusCode === SERVER_ERROR
        ? "An error has occurred on the server"
        : message,
  });
};
