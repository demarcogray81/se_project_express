const { SERVER_ERROR } = require("../utils/errors");

module.exports = (err, req, res) => {
  const { statusCode = SERVER_ERROR, message } = err;

  console.error(`Error ${err.name || "UnknownError"} - ${err.message}`);
  res.status(statusCode).send({
    message:
      statusCode === SERVER_ERROR
        ? "An error has occurred on the server"
        : message,
  });
};
