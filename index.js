const winston = require("winston");
const express = require("express");
const app = express();

require("./startup/logging")();
require("./startup/routes")(app);
require("./startup/configEnv")();
require("./startup/validation")();

require("./startup/db")()

const server = app.listen(process.env.PORT, () => {
  winston.info(`Listening on ${process.env.PORT}`);
});

module.exports = server


