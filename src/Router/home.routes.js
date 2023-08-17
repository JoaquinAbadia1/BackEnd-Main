import { Router } from "express";
import __dirname from "../utils.js";
import { obtenerListaDeProductos } from "../utils.js";

let homeRouter = Router();

homeRouter.get("/", (req, res) => {
  const products = obtenerListaDeProductos();
  res.render("home", { products });
});

export default homeRouter;
