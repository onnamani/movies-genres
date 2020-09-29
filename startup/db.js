const dotenv = require("dotenv");
dotenv.config();
const config = require("config");
const mongoose = require("mongoose");
const winston = require('winston')

const db = config.get("db");

module.exports = function () {
  mongoose
    .connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    })
    .then(() => {
      winston.info("Connected to MongoDB...");
    });
};
