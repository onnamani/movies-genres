const dotenv = require("dotenv");
dotenv.config();
const config = require("config");

module.exports = function() {
  const jwtkey = config.get("jwtPrivateKey") || process.env.JWTKEY;
  
  
  if (!jwtkey) {
    throw new Error("FATAL ERROR: jwtPrivateKey is not defined.");
  }
}