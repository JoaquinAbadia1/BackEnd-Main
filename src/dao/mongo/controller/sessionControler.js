import userModel from "../models/user.models.js";
import { createHash, isValidPassword } from "../../../utils.js";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import Role from "../models/role.models.js";

export const signup = async (req, res) => {
  const { username, email, password, age, roles } = req.body;
  const newUser = new userModel({
    username,
    email,
    password: createHash(password),
    age,
  });

  if (roles) {
    const foundRoles = await Role.find({ name: { $in: roles } });

    newUser.roles = foundRoles.map((role) => role._id);
  } else {
    const role = await Role.findOne({ name: "user" });
    newUser.roles = [role._id];
  }
  const savedUser = await newUser.save();
  console.log(savedUser);

  const token = jwt.sign({ id: savedUser._id }, process.env.SECRET, {
    expiresIn: 86400, // 24 hours
  });
  res.json({ token });
};
export const login = async (req, res) => {
  const { username, password } = req.body;
  const userExist = await userModel
    .findOne({ username: username })
    .populate("roles");
  if (!userExist) return res.status(400).json({ message: "User not found" });
  const matchPassword = isValidPassword(password, userExist.password);
  if (!matchPassword)
    return res.status(401).json({ token: null, message: "Invalid password" });
  const token = jwt.sign({ id: userExist._id }, process.env.SECRET, {
    expiresIn: 86400, // 24 hours
  });
  res.json({ token });
};
