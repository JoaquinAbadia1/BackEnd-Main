import { Router } from "express";
import productManager from "../clases/productManager.js";
import productModel from "../models/products.models.js";

const productRouter = Router();

const product = new productManager("./products.json");

productRouter.get("/:id", async (req, res) => {
  let idParam = req.params.code;
  const newProduct = productModel(req.body);
  const findById = await newProduct.findById(idParam);
  res.json(findById);
});

productRouter.get("/", async (req, res) => {
  const producto = productModel(req.body);
  const products = await producto.find();
  res.json(products);
});
productRouter.post("/newProduct", async (req, res) => {
  const newProduct = productModel(req.body);
  const productSAVED = await newProduct.save();
  product.addProduct(newProduct);
  console.log(productModel(req.body));
  res.send(productSAVED);
});

productRouter.put("/:code", async (req, res) => {
  const {
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    tumbnails,
  } = req.body;
  const product = new productManager("./products.json");
  let idParam = req.params.code;
  try {
    res.json(await product.updateProdcutByID(parseInt(idParam)));
  } catch (error) {
    res.status(500).json({ message: error.message });
    throw new Error(error);
  }
});
productRouter.delete("/:id", async (req, res) => {
  const product = new productManager("./products.json");
  let idParam = req.params.id;
  let producto = await product.getProductsById(parseInt(idParam));
  if (!producto) {
    message = "Producto no encontrado";
  } else {
    let result = await product.deleteProduct(parseInt(idParam));
    res.json({ message: "producto eliminado", result });
  }
});
export default productRouter;
