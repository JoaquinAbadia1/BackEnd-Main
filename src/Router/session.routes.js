import { Router } from "express";
import userModel from "../dao/mongo/models/user.models.js";
import { createHash, isValidPassword } from "../utils.js";
import passport from "passport";

const sessionRouter = Router();
sessionRouter.post(
  "/login",
  passport.authenticate("login", {}),
  async (req, res) => {
    if (!req.user) {
      return res.status(401).json("error de autendicacions");
    } else {
      req.session.user = {
        username: req.user.username,
        password: req.user.password,
        email: req.user.email,
        age: req.user.age,
      };

      res.send({ status: "success", message: "user logged in successfully" });
    }
  }
);
sessionRouter.post(
  "/signup",
  passport.authenticate("signup", {
    failureRedirect: "/fail",
  }),
  async (req, res) => {
    res.send({ status: "success", message: "success registered" });
  }
);
sessionRouter.get("/fail", async (req, res) => {
  res.send({ status: "error", message: "failed" });
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
