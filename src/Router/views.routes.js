import { Router } from "express";
import __dirname from "../utils.js";

import Message from "../dao/mongo/models/chat.models.js";
import productManager from "../dao/mongo/controller/productManager.js";
import cartManager from "../dao/mongo/controller/cartManager.js";
import { verifyToken, isAdmin } from "../middlewares/authJWT.js";

const product = new productManager();
const cart = new cartManager();
let viewsRouter = Router();

viewsRouter.get("/newproduct", [verifyToken, isAdmin], async (req, res) => {
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
viewsRouter.get("/cart/:id", async (req, res) => {
  const cartId = req.params.id;
  const carts = await cart.getCartsById(cartId);
  const cartsParsed = JSON.parse(JSON.stringify(carts));
  const cartProducts = cartsParsed.products;
  //console.log(carts);
  res.render("carts", { cartProducts });
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
