import { Router } from "express";
import __dirname from "../utils.js";
import { obtenerListaDeProductos } from "../utils.js";
import Message from "../models/chat.models.js";

let viewsRouter = Router();

viewsRouter.get("/newproduct", (req, res) => {
  const products = obtenerListaDeProductos();
  res.render("newProduct", { products });
});
viewsRouter.get("/chat", async (req, res) => {
  const messages = await Message.find().sort("-createdAt"); // Recupera los mensajes de la base de datos
  res.render("chat", { messages });
});

export default viewsRouter;
