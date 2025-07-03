const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();
const { PORT = 3001 } = process.env;

app.use(express.json());

app.use((req, _res, next) => {
  req.user = { _id: "5d8b8592978f8bd833ca8133" };
  next();
});

app.use(routes);

app.use(errorHandler);

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    // console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      // console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((_err) => {
    // console.error("MongoDB connection failed:");
  });
