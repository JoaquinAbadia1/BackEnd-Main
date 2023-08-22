import { Router } from "express";
import userModel from "../models/user.models.js";

const sessionRouter = Router();
sessionRouter.post("/login", async (req, res) => {
  console.log(req.body);
  const { username, password } = req.body;

  const result = await userModel.find({
    username,
    password,
  });
  console.log(result);
  if (result.length === 0)
    return res.status(401).json({
      respuesta: "error",
    });
  else {
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
    password,
  });

  if (result === null) {
    return res.status(401).json({
      respuesta: "error",
    });
  } else {
    req.session.user = username;
    req.session.admin = true;
    res.status(200).json({
      respuesta: "ok",
    });
  }
});
export default sessionRouter;
