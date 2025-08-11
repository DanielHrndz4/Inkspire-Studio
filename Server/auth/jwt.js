const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.SECRET_JWT, { expiresIn: "1d" });
};

module.exports = { generateToken };
