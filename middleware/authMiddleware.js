const jwt = require("jsonwebtoken");
const config = require("config");

function auth(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied. No token provided");

  const jwtKey = config.get("jwtPrivateKey") || process.env.JWTKEY;

  try {
    const decodedPayload = jwt.verify(token, jwtKey);
    req.user = decodedPayload;
    next();
  } catch (err) {
    res.status(400).send("Invalid token.");
  }
}

module.exports = auth
