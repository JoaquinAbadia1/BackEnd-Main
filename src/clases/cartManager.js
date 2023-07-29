import fs, { readFileSync } from "fs";
import productManager from "./productManager.js";
import { json } from "express";

class cartManager {
  id;
  carts;
  #path = "";
  constructor(path) {
    this.#path = path;
    this.carts = [];
    this.id = 0;
  }
  async getCarts() {
    try {
      const carts = await fs.promises.readFile(this.#path, "utf-8");
      //console.log(JSON.parse(carts));
      return JSON.parse(carts);
    } catch {
      return [];
    }
  }
  async newCart() {
    this.carts = await this.getCarts();
    this.carts.push({ products: [], id: this.carts.length + 1 });
    console.log(this.carts);
    const result = await fs.promises.writeFile(
      "./carts.json",
      JSON.stringify(this.carts)
    );
    console.log(result);
  }

  async getCartsById(id) {
    const carts = await this.getCarts();
    const cart = carts.map((e) => e.id === id);
    //console.log(cart);
    if (!cart || cart === undefined) {
      throw new Error("debe ingresar un id de carrito existente");
    } else {
      return cart;
    }
  }
  async addProductToCart(id, idProduct) {
    let cart = await this.getCartsById(id);

    if (!cart) {
      throw new Error("no existe carrito");
    }

    let products = JSON.parse(fs.readFileSync("./products.json"));
    const product = products.find((e) => e.id === idProduct);
    console.log(products);
    console.log(product);
    console.log(cart.products);
    let productIndex = cart.products.findIndex(
      (element) => element.id === product.id
    );
    console.log(productIndex);
    productIndex !== -1
      ? cart.products[productIndex].quantity++
      : cart.products.push({
          id: idProduct,
          quantity: 1,
        });
    fs.promises.writeFile(this.#path, JSON.stringify(cart));
  }

  async deleteCart(id) {
    let carts = await this.getCarts();
    let searchIdDelete = carts.map((i) => i.id !== id);
    await fs.promises.writeFile(this.#path, JSON.stringify(searchIdDelete));
    console.log("carrito eliminado con éxito");
  }
}

//const main = async () => {
//  const manager = new cartManager("./carts.json");
//  //await manager.addProductToCart(3, 2);
//  await manager.getCartsById(3);
//  //await manager.getCarts();
//};

//main();
export default cartManager;
