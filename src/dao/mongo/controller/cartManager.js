import fs from "fs";
import ProductManager from "./productManager.js";
import cartModel from "../models/carts.models.js";

class cartManager {
  id;
  carts;
  constructor() {
    this.id = 0;
  }
  async getCarts() {
    try {
      const carts = cartModel.find().lean();
      return carts;
    } catch {
      return [];
    }
  }
  async newCart() {
    let cart = await cartModel.create([{ products: [] }]);
    return cart;
  }

  async getCartsById(id) {
    const carts = cartModel.findById(id);
    return carts;
  }
  async addProductToCart(idCart, codeProduct) {
    let cart = await this.getCartsById(idCart);
    // console.log(cart, "soy el cart");
    if (!cart) {
      throw new Error("no existe carrito");
    }
    let productManager = new ProductManager();
    let products = await productManager.getProducts();
    const product = products.filter((e) => e.code === codeProduct);

    const newCart = await cartModel.findByIdAndUpdate(
      idCart,
      { $push: { products: product } },
      { new: true }
    );
    return newCart;
  }

  async deleteCart(id) {
    let cart = await cartModel.findByIdAndDelete(id);
  }
}

// const main = async () => {
//   const manager = new cartManager("../../carts.json");
//   await manager.addProductToCart(1, 4);
//   await manager.getCartsById(3);
//   await manager.getCarts();
// };

// main();
export default cartManager;
