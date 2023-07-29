import fs from "fs";

class productManager {
  products;
  product;
  #path = "";
  constructor(path) {
    this.#path = path;
  }
  async getProducts() {
    try {
      const products = await fs.promises.readFile(this.#path, "utf-8");
      //console.log(JSON.parse(products));
      return JSON.parse(products);
    } catch {
      return [];
    }
  }

  async addProduct(product) {
    this.products = await this.getProducts();
    //console.log(JSON.parse(products));
    let codeRepeat = this.products.some((dato) => dato.code === product.code);
    if (!this.products) {
      throw new Error("Faltan campos por completar");
    } else if (codeRepeat) {
      throw new Error("codigo repetido");
    } else {
      this.products.push(product);
      await fs.promises.writeFile(this.#path, JSON.stringify(this.products));
    }
  }

  async getProductsByCode(code) {
    let products = await this.getProducts();
    let findCode = products.filter((e) => e.code === product.code);
    console.log(findCode);
    if (findCode) {
      console.log(findCode);
      return findCode;
    } else {
      throw new Error("El ID indicado no existe");
    }
  }

  async deleteProduct(code) {
    let product = await this.getProducts();
    let searchIdDelete = product.map((i) => i.code !== product.code);
    await fs.promises.writeFile(this.#path, JSON.stringify(searchIdDelete));
    console.log("Producto eliminado con éxito");
  }
  async updateProdcutByCode(code, modified) {
    let product = await this.getProducts();
    let productByCode = await this.getProductsByCode(code);
    //console.log(product);
    if (!productByCode) {
      throw new Error("No se a econtrado el codigo especificado");
    } else {
      const modified = productByCode.push(modified);
      await fs.promises.writeFile(this.#path, JSON.stringify(modified));
      console.log("Modificación realizada con éxito.");
    }
  }
}

export default productManager;
