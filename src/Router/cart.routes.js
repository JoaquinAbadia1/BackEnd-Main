import { Router } from "express";
import cartManager from "../clases/cartManager.js";

const cartRouter = Router();
const cart = new cartManager("./carts.json");

cartRouter.post("/newCart", async (req, res) => {
  try {
    await cart.newCart();
    res.json({
      status: "200 ok",
      message: `el carrito se añadio correctamente`,
    });
  } catch (err) {
    throw new Error(err);
  }
});
cartRouter.post("/:cid/product/:pid", async (req, res) => {
  const idCart = Number(req.params.cid);
  const idProduct = Number(req.params.pid);
  try {
    const productAdd = await cart.addProductToCart(idCart, idProduct);
    res.json({ status: "200 ok", message: productAdd });
  } catch (error) {
    throw new Error(error);
  }
});

cartRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    let idParam = id;
    res.json(await cart.getCartsById(parseInt(idParam)));
  } catch (error) {
    throw new Error(error);
  }
});

cartRouter.get("/", async (req, res) => {
  const { limit } = req.query;
  try {
    let carts = await cart.getCarts();
    if (limit) {
      let temp = carts.filter((dat, index) => index < limit);
      res.json({ dat: temp, limit: limit, quantity: temp.length });
    } else {
      res.json(carts);
    }
  } catch (err) {
    console.log(err);
  }
});
cartRouter.delete("/:id", async (req, res) => {
  const carts = new cartManager("./carts.json");
  let idParam = req.params.id;
  let cart = await carts.getCartsById(parseInt(idParam));
  if (!cart) {
    message = "carrito no encontrado";
  } else {
    let result = await carts.deleteCart(parseInt(idParam));
    res.json({ message: "carrito eliminado", result });
  }
});
cartRouter.put("/", async (req, res) => {
  try {
  } catch (error) {}
});

export default cartRouter;
