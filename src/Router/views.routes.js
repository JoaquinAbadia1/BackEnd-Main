import { Router } from "express";
import __dirname from "../utils.js";
import { obtenerListaDeProductos } from "../utils.js";

let viewsRouter = Router();

viewsRouter.get("/home", (req, res) => {
  const products = obtenerListaDeProductos();
  res.render("home", { products });
});

viewsRouter.get("/realtime", (req, res) => {
  const products = obtenerListaDeProductos();
  res.render("realtime", { products });
});
viewsRouter.get("/chat", (req, res) => {
  res.render("chat", {});
});
export default viewsRouter;
