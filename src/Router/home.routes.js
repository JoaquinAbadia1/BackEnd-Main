import { Router } from "express";
import __dirname from "../utils.js";

import productModel from "../dao/mongo/models/products.models.js";
let homeRouter = Router();
import productManager from "../dao/mongo/controller/productManager.js";

const product = new productManager();
homeRouter.get("/", async (req, res) => {
  const products = await product.getProducts();
  //console.log(products);
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
