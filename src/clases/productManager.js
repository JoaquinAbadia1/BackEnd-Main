import fs from "fs";
import productModel from "../models/products.models.js";
class productManager {
  products;
  product;
  #path = "";
  constructor(path) {
    this.#path = path;
  }
  async getProducts() {
    try {
      const products = await productModel.find().lean();
      return products;
    } catch {
      return [];
    }
  }

  async addProduct(product) {
    const allProducts = await productModel.find().lean();
    //console.log(allProducts);
  }

  async getProductsByCode(code) {}

  async deleteProduct(code) {}
  async updateProdcutByCode(code, modified) {}
}

export default productManager;
