import { Router } from "express";
//import productManager from "../Manager/productManager";
import productModel from "../models/products.models.js";

const productRouter = Router();

productRouter.get("/:id", async (req, res) => {
  let idParam = req.params.code;
  const findById = productModel.findById(idParam);
  res.json(findById);
});

productRouter.get("/", async (req, res) => {
  const limit = req.params.limit || 10;
  const allProducts = await productModel.paginate({}, { limit });

  res.json(allProducts);
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
