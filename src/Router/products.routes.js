import { Router } from "express";
import productManager from "../clases/productManager.js";
import productModel from "../models/products.models.js";

const productRouter = Router();

const product = new productManager("./products.json");

productRouter.get("/:id", async (req, res) => {
  let idParam = req.params.code;
  const findById = productModel.findById(idParam);
  res.json(findById);
});

productRouter.post("/addnewProduct", async (req, res) => {});

productRouter.put("/:code", async (req, res) => {});
productRouter.delete("/:id", async (req, res) => {});
export default productRouter;
