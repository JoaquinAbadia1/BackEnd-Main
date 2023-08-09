import { Router } from "express";
import userModel from "../models/users.models.js";

const userRouter = Router();

userRouter.get("/allusers", async (req, res) => {
  try {
    const result = await userModel.find();
    res.json({
      data: result,
      message: result.length ? "lista de usuarios" : "No hay usuarios",
    });
  } catch (err) {
    throw new Error(err);
  }
});

userRouter.post("/allusers", async (req, res) => {
  try {
    const { fullName, email } = req.body;
    if (!fullName || !email) {
      message = "Faltan datos";
    } else {
      const result = await userModel.create(req.body);
      res.json({
        data: result,
        message: "usuario creado con exito",
      });
    }
  } catch (error) {
    throw new Error(error);
  }
});

export default userRouter;
