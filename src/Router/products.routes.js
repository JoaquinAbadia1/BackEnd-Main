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
productRouter.delete("/productos/:id", async (req, res) => {
  try {
    const producto = await productModel.findByIdAndRemove(req.params.id);
    if (!producto) {
      return res.status(404).send("Producto no encontrado");
    }
    return res.status(200).send("Producto eliminado correctamente");
  } catch (error) {
    return res.status(500).send("Error al eliminar el producto");
  }
});
export default productRouter;
