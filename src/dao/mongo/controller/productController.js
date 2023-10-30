import fs from "fs";
import productModel from "../models/products.models.js";
import CustomError, {
  enumErrors,
} from "../../../services/errors/customErrors.js";
class productManager {
  products;
  product;
  constructor() {}
  async getProducts() {
    try {
      const products = await productModel.find().lean();
      return products;
    } catch {
      CustomError.createError({
        name: "error en la base de datos",
        message: "error al obtener los productos",
        code: enumErrors.DATABASE_ERROR,
      });
    }
  }

  async addProduct(product) {
    try {
      const newProduct = new productModel(product);
      const productSave = await newProduct.save();
      return productSave;
    } catch (error) {
      CustomError.createError({
        name: "error en la base de datos",
        message: "error al agregar el producto",
        code: enumErrors.DATABASE_ERROR,
      });
    }
  }

  async getProductsByCode(code) {
    try {
      const productById = await productModel.findById(code);
      return productById;
    } catch {
      CustomError.createError({
        name: "error en la base de datos",
        message: "error al obtener el producto",
        code: enumErrors.DATABASE_ERROR,
      });
    }
  }

  async deleteProduct(code) {
    try {
      const productById = await productModel.findByIdAndDelete(code);
      return productById;
    } catch (error) {
      CustomError.createError({
        name: "error en la base de datos",
        message: "error al obtener el producto",
        code: enumErrors.DATABASE_ERROR,
      });
    }
  }
  async updateProdcutByCode(code, modified) {
    try {
      const productById = await productModel.findByIdAndUpdate(code, modified);
      return productById;
    } catch (error) {
      CustomError.createError({
        name: "error en la base de datos",
        message: "error al modificar el producto",
        code: enumErrors.DATABASE_ERROR,
      });
    }
  }
  async removeStock(code, quantity) {
    try {
      const productById = await productModel.findById(code);
      productById.stock -= quantity;
      const productSave = await productById.save();
      return productSave;
    } catch (error) {
      CustomError.createError({
        name: "error en la base de datos",
        message: "error al modificar el producto",
        code: enumErrors.DATABASE_ERROR,
      });
    }
  }
}
export default productManager;
