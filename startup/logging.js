const winston = require("winston");
require("winston-mongodb");
const dotenv = require("dotenv");
dotenv.config();
const config = require('config')

module.exports = function() {
  winston.exceptions.handle(
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({ filename: "uncaughtExceptions.log" })
  );

  process.on("unhandledRejection", (ex) => {
    throw ex;
  });

  winston.add(new winston.transports.File({ filename: "logfile.log" }));
  winston.add(new winston.transports.Console({ colorize: true, prettyPrint: true, level: "info" }))
  winston.add(
    new winston.transports.MongoDB({
      db: config.get("db"),
      options: { useUnifiedTopology: true },
      metaKey: "meta",
      level: "error",
    })
  );
}