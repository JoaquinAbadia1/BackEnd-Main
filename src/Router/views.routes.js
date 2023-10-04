import { Router } from "express";
import __dirname from "../utils.js";

import Message from "../dao/mongo/models/chat.models.js";
import productManager from "../dao/mongo/controller/productManager.js";

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
viewsRouter.get("/login", async (req, res) => {
  res.render("login", {
    title: "Iniciar Sesion",
  });
});
viewsRouter.get("/signup", (req, res) => {
  res.render("signup", {
    title: "Crea tu cuenta",
  });
});
viewsRouter.get("/forgotpassword", (req, res) => {
  res.render("forgotPassword", {
    title: "Recupera tu contraseña",
  });
});

export default viewsRouter;
