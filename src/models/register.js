const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const employeeSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid Details");
      }
    },
  },
  address: {
    type: String,
    trim: true,
    minlength: 5,
  },
  city: {
    type: String,
    trim: true,
  },
  state: {
    type: String,
    trim: true,
    minlength: 5,
  },
  zip: {
    type: Number,
    min: 6,
    trim: true,
  },
  tokens:[{
    token:{
      type: String,
      required: true
    }
  }]
});

employeeSchema.methods.generateAuthToken = async function () {
  try {
    const token = await jwt.sign({_id:this._id.toString()}, process.env.SECRET_KEY);
    this.tokens = this.tokens.concat({token: token});
    await this.save();
    return token;
  } catch (error) {
      res.send(error);
  }
};

employeeSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      this.password = await bcrypt.hash(this.password, 10);
      // console.log(this.password);
    }
    next();
  } catch (error) {
      res.send(error);
  }
});

const EmployeeReg = new mongoose.model("EmployeeReg", employeeSchema);

module.exports = EmployeeReg;
