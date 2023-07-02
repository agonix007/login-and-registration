require("dotenv").config();
const express = require("express");
require("./db/conn");
const path = require("path");
const hbs = require("hbs");
const cookieParser = require("cookie-parser");

const employeeRouter = require("./routers/routing");
const auth = require("./middleware/auth");

const app = express();
const PORT = process.env.PORT;

const staticPath = path.join(__dirname, "../public");
const templatePath = path.join(__dirname, "../templates/views");
const partialPath = path.join(__dirname, "../templates/partials");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(employeeRouter);
app.use(express.static(staticPath));
app.set("view engine", "hbs");
app.set("views", templatePath);

hbs.registerPartials(partialPath);

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/secret", auth, (req, res) => {
  res.render("secret", {
    name: req.employee.fname,
  });
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("*", (req, res) => {
  res.render("404");
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
