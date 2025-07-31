require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const routes = require("./routes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();
const { PORT = 3001, CORS_ORIGIN = "http://localhost:3000" } = process.env;

// Enable CORS for your React dev server
app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true, // allow cookies and auth headers
  })
);

app.use(express.json());
app.use(routes);
app.use(errorHandler);

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    // console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      // console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  });
