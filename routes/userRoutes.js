const express = require("express");
const { UserModel } = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const userRouter = express.Router();

//Getting all the users in json format:
userRouter.get("/api", async (req, res) => {
  try {
    const users = await UserModel.find();
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "Error in getting users" });
  }
});

//Registering new user:
userRouter.post("/register", async (req, res) => {
  const { name, email, gender, password } = req.body;
  try {
    const old = await UserModel.findOne({ email });
    if (old) {
      res.json({ msg: `${old.name} already exists, Please Login` });
    } else {
      bcrypt.hash(password, 5, async (err, hash) => {
        let user = new UserModel({ name, email, gender, password: hash });
        await user.save();
        res.status(201).json({ msg: `${name} has been registered!` });
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ msg: "Error in registering user" });
  }
});

//Logging in:
userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          const token = jwt.sign(
            { id: `${user._id}`, name: `${user.name}` },
            process.env.key
          );
          res.status(201).json({ msg: `Welcome ${user.name}`, token: token });
        } else {
          res.status(200).json({ msg: "Wrong Credentials" });
        }
      });
    }
  } catch (error) {
    res.json({ msg: "Error in logging in route" });
    console.log(error);
  }
});

module.exports = { userRouter };
