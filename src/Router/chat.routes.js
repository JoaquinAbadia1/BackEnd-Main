import { Router } from "express";
import __dirname from "../utils.js";
import chatsModel from "../models/chat.models.js";

let chatRouter = Router();

chatRouter.get("/", (req, res) => {
  res.render("chat", {});
});

chatRouter.post("/", (req, res) => {
  const result = 
});
export default chatRouter;
