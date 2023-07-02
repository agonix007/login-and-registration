const jwt = require("jsonwebtoken");
const EmployeeReg = require("../models/register");

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    const verifyUser = await jwt.verify(token, process.env.SECRET_KEY);
    const employee = await EmployeeReg.findOne({ _id: verifyUser._id });
    // console.log(employee);
    req.token = token;
    req.employee = employee;
    next();
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = auth;
