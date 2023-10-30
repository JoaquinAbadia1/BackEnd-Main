import userModel from "../models/user.models.js";
import { createHash, isValidPassword } from "../../../utils.js";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import Role from "../models/role.models.js";
import CustomError from "../../../services/errors/customErrors.js";
import { enumErrors, generateUserErrorInfo } from "../../../services/errors/customErrors.js";

export const signup = async (req, res) => {
  const { username, email, password, age, roles } = req.body;
  const newUser = new userModel({
    username,
    email,
    password: createHash(password),
    age,
    roles,
  });
  const emailExist = await userModel.findOne({ email: email });
  const usernameExist = await userModel.findOne({ username: username });
  if (!username || !email || !password || !age) {
    CustomError.createError({
      name: "Error creando usuario",
      cause: generateUserErrorInfo({
        first_name,
        last_name,
        age,
        email,
      }),
      message: "Error trying to create a user",
      code: enumErrors.INVALID_TYPE_ERROR,
    });
  } else if (emailExist || usernameExist) {
    CustomError.createError({
      name: "Error creando usuario",
      message: "error duplicate key",
      code: enumErrors.DUPLICATE_KEY_ERROR,
    });
  }
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

  const userExist = await userModel.findOne({ username: username }).populate("roles");
  if (!userExist) {
    CustomError.createError({
      name: "error al loguear",
      message: "usuario no existe",
      code: enumErrors.AUTHENTICATION_ERROR,
    });
  }
  const matchPassword = isValidPassword(password, userExist.password);
  if (!matchPassword) {
    CustomError.createError({
      name: "error al loguear",
      message: "error de autenticacion",
      code: enumErrors.AUTHENTICATION_ERROR,
    });
  }
  // const token = jwt.sign({ id: userExist._id }, process.env.SECRET, {
  //   expiresIn: 86400, // 24 hours
  // });
  // localStorage.setItem("token", token);

  // res.json({ token });
  console.log(token);
};
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const userExist = await userModel.findOne({ email: email });
  if (!userExist) {
    CustomError.createError({
      name: "error al loguear",
      message: "usuario no existe",
      code: enumErrors.AUTHENTICATION_ERROR,
    });
  }
  const message = { message: "email enviado" };
  const token = jwt.sign({ id: userExist._id }, process.env.SECRET, {
    expiresIn: 3600000, // 1 hour
  });
  const verificationLink = `http://localhost:8080/resetpassword/${token}`;
  res.json({ verificationLink });
};
