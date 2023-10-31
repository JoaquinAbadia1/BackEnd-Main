import ProductManager from "./productController.js";
import cartModel from "../models/carts.models.js";
import CustomError, { enumErrors } from "../../../services/errors/customErrors.js";
import orderModel from "../models/order.models.js";
import userModel from "../models/user.models.js";
import { transporter } from "../../../config/mailing.config.js";
import productModel from "../models/products.models.js";
import * as dotenv from "dotenv";
import jwt from "jsonwebtoken";
import * as cookie from "cookie";

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
      CustomError.createError({
        name: "error en la base de datos",
        message: "error al traer los carritos",
        code: enumErrors.DATABASE_ERROR,
      });
    }
  }
  async newCart() {
    try {
      let cart = await cartModel.create([{ products: [] }]);
      return cart;
    } catch {
      CustomError.createError({
        name: "error en la base de datos",
        message: "error al crear el carrito",
        code: enumErrors.DATABASE_ERROR,
      });
    }
  }

  async getCartsById(id) {
    try {
      const carts = cartModel.findById(id);
      return carts;
    } catch {
      CustomError.createError({
        name: "error en la base de datos",
        message: "error al obtener el carrito",
        code: enumErrors.DATABASE_ERROR,
      });
    }
  }
  async addProductToCart(idCart, codeProduct) {
    try {
      let cart = await this.getCartsById(idCart);

      if (!cart) {
        CustomError.createError({
          name: "error en la base de datos",
          message: "no existe el carrito",
          code: enumErrors.NOT_FOUND_ERROR,
        });
      }

      let productManager = new ProductManager();
      let products = await productManager.getProducts();
      const product = products.find((e) => e.code === codeProduct);
      const productExist = cart.products.find((e) => e.code === codeProduct);
      if (!productExist) {
        cart.products.push(product);
      } else {
        const newProducts = cart.products.filter((e) => e.code !== codeProduct);
        cart.products = newProducts;
        productExist.quantity += 1;
        cart.products.push(productExist);
      }
      await cart.save();
      return cart;
    } catch {
      CustomError.createError({
        name: "error en la base de datos",
        message: "error al obtener el carrito",
        code: enumErrors.DATABASE_ERROR,
      });
    }
  }
  async deleteFromCart(idCart, codeProduct) {
    try {
      let cart = await this.getCartsById(idCart);

      if (!cart) {
        CustomError.createError({
          name: "error en la base de datos",
          message: "no existe el carrito",
          code: enumErrors.NOT_FOUND_ERROR,
        });
      }

      let productManager = new ProductManager();
      let products = await productManager.getProducts();
      const product = products.find((e) => e.code === codeProduct);
      const productExist = cart.products.find((e) => e.code === codeProduct);
      if (!productExist) {
        cart.products.push(product);
      } else {
        const newProducts = cart.products.filter((e) => e.code !== codeProduct);
        cart.products = newProducts;
        productExist.quantity -= 1;
        cart.products.push(productExist);
      }
      await cart.save();
      return cart;
    } catch {
      CustomError.createError({
        name: "error en la base de datos",
        message: "error al obtener el carrito",
        code: enumErrors.DATABASE_ERROR,
      });
    }
  }

  async deleteCart(id) {
    try {
      let cart = await cartModel.findByIdAndDelete(id);
      return cart;
    } catch {
      CustomError.createError({
        name: "error en la base de datos",
        message: "error al obtener el carrito",
        code: enumErrors.DATABASE_ERROR,
      });
    }
  }
  submitOrder = async (idCart, order, req) => {
    dotenv.config();
    const token = req.cookies.token;

    const decodedToken = jwt.verify(token, process.env.SECRET);
    //console.log(decodedToken);
    // Realiza una consulta a la base de datos para obtener el nombre de usuario a partir del ID del usuario
    const user = await userModel.findById(decodedToken.id);

    if (!user) {
      throw new Error("Usuario no encontrado");
    }
    const username = user.username; // Obtiene el nombre de usuario
    const email = user.email; // Obtiene el correo electrónico del usuario
    console.log(username, email);

    try {
      let cart = await this.getCartsById(idCart);
      if (!idCart) {
        CustomError.createError({
          name: "error en la base de datos",
          message: "no existe el carrito",
          code: enumErrors.NOT_FOUND_ERROR,
        });
      }
      let orderCreate = await orderModel.create({
        products: cart.products,
        user: user.username,
      });
      console.log(orderCreate);

      const productDetails = [];

      // Recorre los IDs de los productos en la orden y obtén los detalles de cada producto.
      for (const productId of orderCreate.products) {
        const product = await productModel.findById(productId);

        if (product) {
          // Crea un objeto que contenga los detalles del producto.
          const productInfo = {
            title: product.title,
            price: product.price,
            stock: product.stock,
            code: product.code,
            quantity: product.quantity,
          };

          productDetails.push(productInfo);
        }
      }
      const mail = await userModel.findOne({ username: username });
      await transporter.sendMail({
        from: '"Resumen de Compra" <abadiajoaquin04@gmail.com>', // sender address
        to: "joaquinabadia04@gmail.com", // list of receivers
        subject: "Resumen de Compra", // Subject line
        text: "Muchas gracias por comprar en GameFusion, que disfrutes tu compra", // plain text body

        // Luego, puedes mostrar los títulos de los productos en el correo electrónico.
        html: `
        <h1>Gracias por su compra</h1>
        <h3>Detalles de su compra</h3>
        <ul>
          ${productDetails
            .map(
              (product) => `
            <li>
              Título: ${product.title}<br>
              Precio:$ ${product.price}<br>
              Cantidad: ${product.quantity}<br>
            </li>
          `
            )
            .join("")}
          <li>Usuario: ${username}</li>
        </ul>
      `, // html body
      });

      cart.order = orderCreate;
      await cart.save();

      return cart;
    } catch {
      CustomError.createError({
        name: "error en la base de datos",
        message: "error al obtener el carrito",
        code: enumErrors.DATABASE_ERROR,
      });
    }
  };
}

export default cartManager;
