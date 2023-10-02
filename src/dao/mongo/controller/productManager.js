import fs from "fs";
import productModel from "../models/products.models.js";
class productManager {
  products;
  product;
  #path = "";
  constructor() {}
  async getProducts() {
    try {
      const products = await productModel.find().lean();
      return products;
    } catch {
      return [];
    }
  }

  async addProduct(product) {
    const newProduct = await productModel.create(product);
    return newProduct;
  }

  async getProductsByCode(code) {
    const productById = await productModel.findById(code);
    return productById;
  }

  async deleteProduct(code) {
    const productById = await productModel.findByIdAndDelete(code);
    return productById;
  }
  async updateProdcutByCode(code, modified) {
    const productById = await productModel.findByIdAndUpdate(code, modified);
    return productById;
  }
}

export default productManager;
