const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();

const requireCustomerAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  console.log(authorization);
  if (!authorization) {
    return res.status(401).json({ error: "Authorization token required" });
  }
  const token = authorization.split(" ")[1];

  try {
    const { _id } = jwt.verify(token, process.env.USER_JWT_SCERET);

    req.user = await User.findOne({ _id });

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Request is not authorized" });
  }
};

module.exports = requireCustomerAuth;
