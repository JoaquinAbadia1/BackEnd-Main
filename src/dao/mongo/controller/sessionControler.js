import userModel from "../models/user.models.js";
import { createHash, isValidPassword } from "../../../utils.js";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import cookie from "cookie";
import Role from "../models/role.models.js";
import CustomError from "../../../services/errors/customErrors.js";
import { enumErrors, generateUserErrorInfo } from "../../../services/errors/customErrors.js";
import { transporter } from "../../../config/mailing.config.js";
import cartModel from "../models/carts.models.js";
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
    console.log("usuario no existe");
  }
  const matchPassword = isValidPassword(password, userExist.password);
  if (!matchPassword) {
    console.log("contraseña incorrecta");
  }
  const token = jwt.sign({ id: userExist._id }, process.env.SECRET, {
    expiresIn: "24h", // 24 hours
  });

  const email = userExist.email;
  // Establecer una cookie llamada "token" con el valor del token
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("token", token, {
      // Para que la cookie no sea accesible desde JavaScript en el navegador
      maxAge: 86400, // Tiempo de expiración en segundos (aquí, 24 horas)
      path: "/", // La cookie estará disponible en todas las rutas del sitio
    })
  );

  console.log(token);
  res.json({ token });
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
    expiresIn: "1h",
  });
  const verificationLink = `http://localhost:8080/api/views/regeneratepass/${token}`;
  await transporter.sendMail({
    from: '"restablecer contraseña" <abadiajoaquin04@gmail.com>', // sender address
    to: email, // list of receivers
    subject: "restablecer contraseña", // Subject line
    html: `
      <p>Para recuperar tu contraseña haz click en el siguiente link</p>
      <a href="${verificationLink}">Recuperar contraseña</a>
      `, // html body
  });
  res.json({ verificationLink });
};
export const logout = async (req, res) => {
  req.session.destroy();
  res.clearCookie("token", "cartId");
  res.redirect("/");
  localStorage.clear();
};
export const updatePassword = async (req, res) => {
  const { password, newPassword, username } = req.body;

  const user = await userModel.findById(username.id);
  const matchPassword = isValidPassword(password, user.password);
  if (!matchPassword) {
    CustomError.createError({
      name: "error al loguear",
      message: "contraseña incorrecta",
      code: enumErrors.AUTHENTICATION_ERROR,
    });
  } else {
    user.password = createHash(newPassword);
    await user.save();
    res.json({ message: "contraseña actualizada" });
  }
};
