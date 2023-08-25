import { Router } from "express";
import userModel from "../models/user.models.js";
import { createHash, isValidPassword } from "../utils.js";

const sessionRouter = Router();
sessionRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const result = await userModel.find({
    username: username,
  });
  console.log(isValidPassword(result[0].password, password));
  console.log(result);
  if (result.length === 0)
    return res.status(401).json({
      respuesta: "error",
    });
  else if (!isValidPassword(result[0].password, password)) {
    return res.status(401).json({
      respuesta: "El Usuario no existe",
    });
  } else {
    req.session.user = username;
    req.session.admin = true;
    res.status(200).json({
      respuesta: "ok",
    });
  }
});
sessionRouter.post("/signup", async (req, res) => {
  const { username, password, age, email } = req.body;

  const result = await userModel.create({
    username,
    age,
    email,
    password: createHash(password),
  });

  if (result === null) {
    return res.status(401).json({
      respuesta: "error",
    });
  }
});
sessionRouter.post("/forgot", async (req, res) => {
  const { username, newPassword } = req.body;

  const result = await userModel.find({
    username,
  });
  if (result.length === 0) {
    return res.status(401).json({
      respuesta: "error",
    });
  } else {
    const resultado = await userModel.findByIdAndUpdate(result[0]._id, {
      password: createHash(newPassword),
    });
    return res.status(200).json({
      respuesta: "la contraseña a sido cambiada exitosamente",
    });
  }
});
export default sessionRouter;
