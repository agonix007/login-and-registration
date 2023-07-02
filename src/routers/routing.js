const express = require("express");
const bcrypt = require("bcryptjs");
const EmployeeReg = require("../models/register");
const auth = require("../middleware/auth");

const router = new express.Router();

router.post("/register", async (req, res) => {
  try {
    const password = req.body.password;
    const cpassword = req.body.cpassword;
    if (password === cpassword) {
      const registerEmployee = new EmployeeReg({
        fname: req.body.fname,
        password: req.body.password,
        email: req.body.email,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip,
      });
      const token = await registerEmployee.generateAuthToken();
      // console.log(token);
      res.cookie("jwt", token, {
        expires: new Date(Date.now() + 30000),
        httpOnly: true,
      });
      await registerEmployee.save();
      res.status(201).render("index");
    } else {
      res.status(401).send("Password are not matching.");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const employee = await EmployeeReg.findOne({ email: email });
    // if (employee.password === password) {
    //   res.status(200).render("index");
    // } else {
    //   res.status(401).send("Invalid login details.");
    // }
    const isMatch = await bcrypt.compare(password, employee.password);
    if (isMatch) {
      const token = await employee.generateAuthToken();
      // console.log(token);
      res.cookie("jwt", token, {
        expires: new Date(Date.now() + 30000),
        httpOnly: true,
      });
      res.status(201).render("index");
    } else {
      res.status(401).send("Invalid login details.");
    }
  } catch (error) {
    res.status(400).send("Invalid login details.");
  }
});

router.get("/logout", auth, async (req, res) => {
  try {
    // console.log(req.employee);
    req.employee.tokens = req.employee.tokens.filter((currToken) => {
      return currToken.token !== req.token;
    });
    res.clearCookie("jwt");
    console.log("Logout Successfully");
    await req.employee.save();
    res.render("login");
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/logoutAll", auth, async (req, res) => {
  try {
    // console.log(req.employee);
    req.employee.tokens = [];
    res.clearCookie("jwt");
    console.log("Logout Successfully");
    await req.employee.save();
    res.render("login");
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
