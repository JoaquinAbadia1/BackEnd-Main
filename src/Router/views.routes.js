import { Router } from "express";
import __dirname from "../utils.js";

import Message from "../dao/mongo/models/chat.models.js";
import productManager from "../controller/productManager.js";

const product = new productManager();

let viewsRouter = Router();

viewsRouter.get("/newproduct", async (req, res) => {
  const products = await product.getProducts();
  //console.log(products);
  res.render("newProduct", { products });
});
viewsRouter.get("/chat", async (req, res) => {
  const messages = await Message.find().sort("-createdAt"); // Recupera los mensajes de la base de datos
  res.render("chat", { messages });
});
viewsRouter.get("/contact", async (req, res) => {
  res.render("contacto", {});
});

export default viewsRouter;
