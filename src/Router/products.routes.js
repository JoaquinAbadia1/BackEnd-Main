import { Router } from "express";
import productManager from "../dao/mongo/controller/productManager.js";
//import productManager from "../Manager/productManager";
import productModel from "../dao/mongo/models/products.models.js";

const productRouter = Router();

productRouter.get("/:code", async (req, res) => {
  const code = req.params.code;
  const product = await productManager.getProductByCode(code);
  res.json(product);
});

productRouter.get("/", async (req, res) => {
  const products = await productManager.getProducts();
  res.json(products);
});

productRouter.post("/addnewProduct", async (req, res) => {
  const product = req.body;
  const newProduct = await productManager.addProduct(product);
  res.json(newProduct);
});

productRouter.put("/:code", async (req, res) => {
  const code = req.params.code;
  const modified = req.body;
  const product = await productManager.updateProductByCode(code, modified);
  res.json(product);
});
productRouter.delete("/productos/:code", async (req, res) => {
  const code = req.params.code;
  const product = await productManager.deleteProduct(code);
  res.json(product);
});
export default productRouter;
