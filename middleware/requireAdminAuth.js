const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");
require("dotenv").config();

const requireAdminAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  console.log(authorization);
  if (!authorization) {
    return res.status(401).json({ error: "Authorization token required" });
  }
  const token = authorization.split(" ")[1];

  try {
    const { _id } = jwt.verify(token, process.env.ADMIN_JWT_SCERET);

    req.admin = await Admin.findOne({ _id }).select("_id");
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Request is not authorized" });
  }
};

module.exports = requireAdminAuth;
