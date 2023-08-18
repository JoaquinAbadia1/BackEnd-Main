import { Router } from "express";
import __dirname from "../utils.js";
import { obtenerListaDeProductos } from "../utils.js";
import productModel from "../models/products.models.js";
let homeRouter = Router();

homeRouter.get("/", async (req, res) => {
  const products = obtenerListaDeProductos();
  const { page = 1 } = req.query;

  const { docs, hasPrevPage, hasNextPage, nextPage, prevPage } =
    await productModel.paginate({}, { limit: 5, page, lean: true });

  res.render("home", {
    docs,
    hasPrevPage,
    hasNextPage,
    prevPage,
    nextPage,
    products,
  });
});

export default homeRouter;
