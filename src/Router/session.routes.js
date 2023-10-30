import { Router } from "express";
import userModel from "../dao/mongo/models/user.models.js";
import { createHash, isValidPassword } from "../utils.js";
import passport from "passport";
import * as authControler from "../dao/mongo/controller/sessionControler.js";

const sessionRouter = Router();
//login
sessionRouter.post("/login", authControler.login);
//singUp
sessionRouter.post("/signup", authControler.signup);
//forgotPassword
sessionRouter.post("/forgotPassword", authControler.forgotPassword);
// Iniciar sesion con GitHub API
sessionRouter.get("/github", passport.authenticate("github", { scope: ["user:username"] }), async (req, res) => {});
//en caso de que falle el login con GitHub
sessionRouter.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/login" }), async (req, res) => {
  req.session.user = req.user;
  req.session.admin = true;
  res.redirect("/");
});
export default sessionRouter;
