const dotenv = require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const routes = require("./src/controller/userController.js");
const corsOptions = process.env.origin;
const app = express();

const jwt = require("jsonwebtoken");

require("crypto").randomBytes(128).toString("hex");
app.use(cors(corsOptions));
app.use(express.json());

const uri = process.env.MONGO_DB_URI;
const PORT = process.env.PORT || 8081;

const run = () => {
  app.listen(PORT, () =>
    console.log("Congratulations Server started Successfully on PORT:", PORT)
  );
};

mongoose
  .connect(uri)
  .then(() => {
    console.log("Wait until Project Build Finishes");
    console.log("---------------------------------------------------");
    run();
  })
  .catch((err) => {
    console.log(err);
  });

app.post("/register", routes.register);
app.post("/login", routes.login);

app.post("/login", (req, res) => {});

module.exports = { app };
