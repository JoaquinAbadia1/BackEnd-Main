import { Router } from "express";
import __dirname from "../utils.js";
import { obtenerListaDeProductos } from "../utils.js";

let viewsRouter = Router();

viewsRouter.get("/", (req, res) => {
  const products = obtenerListaDeProductos();
  res.render("home", { products });
});

viewsRouter.get("/realtime", (req, res) => {});
export default viewsRouter;
