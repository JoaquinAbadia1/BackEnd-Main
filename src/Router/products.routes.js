import { Router } from "express";
import productManager from "../clases/productManager.js";

const productRouter = Router();

const product = new productManager("./products.json");

productRouter.get("/", async (req, res) => {
  const { limit } = req.query;
  try {
    let products = await product.getProducts();
    if (limit) {
      let temp = products.filter((dat, index) => index < limit);
      res.json({ data: temp, limit: limit, quantity: temp.length });
    } else {
      res.json(products);
    }
  } catch (err) {
    console.log(err);
  }
});

productRouter.get("/:id", async (req, res) => {
  try {
    let idParam = req.params.id;
    res.json(await product.getProductsById(parseInt(idParam)));
  } catch (error) {
    throw new Error(error);
  }
});

productRouter.post("/newProduct", async (req, res) => {
  const { title, description, code, price, stock, category, tumbnail } =
    req.body;
  const product = {};
  if (!title || !description || !code || !price || !stock || !category) {
    res.json({ error: "Faltan datos" });
  } else {
    const product = new productManager("./products.json");
    try {
      let newProduct = await product.addProduct(req.body);
      res.json(newProduct);
    } catch (error) {
      res.status(500).json({ message: error.message });
      throw new Error(error);
    }
  }
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
