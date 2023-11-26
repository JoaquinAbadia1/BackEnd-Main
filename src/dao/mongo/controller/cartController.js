import ProductManager from "./productController.js";
import cartModel from "../models/carts.models.js";
import orderModel from "../models/order.models.js";
import userModel from "../models/user.models.js";
import { transporter } from "../../../config/mailing.config.js";
import productModel from "../models/products.models.js";
import jwt from "jsonwebtoken";

class CartManager {
  async getCarts() {
    try {
      const carts = await cartModel.find().lean();
      return carts;
    } catch (error) {
      console.error(error);
    }
  }

  async newCart(user, token) {
    try {
      const decodedToken = jwt.verify(token, process.env.SECRET);
      const userId = decodedToken.id;

      const cart = await cartModel.create({ products: [], user: userId });

      user.cartId = cart._id;
      await user.save();

      return cart;
    } catch (error) {
      console.error(error);
      throw new Error("Error al crear el carrito");
    }
  }

  async getCartsById(id) {
    try {
      const cart = await cartModel.findById(id);
      return cart;
    } catch (error) {
      console.error(error);
    }
  }

  async addProductToCart(idCart, codeProduct) {
    try {
      const cart = await this.getCartsById(idCart);

      if (!cart) {
        console.error("No existe el carrito");
      }

      const productManager = new ProductManager();
      const products = await productManager.getProducts();
      const product = products.find((e) => e.code === codeProduct);
      const productExist = cart.products.find((e) => e.code === codeProduct);

      if (!productExist) {
        cart.products.push({ ...product.toObject(), quantity: 1 });
      } else {
        productExist.quantity += 1;
      }

      await cart.save();
      return cart;
    } catch (error) {
      console.error(error);
    }
  }

  async deleteFromCart(idCart, codeProduct) {
    try {
      const cart = await this.getCartsById(idCart);

      if (!cart) {
        console.error("No existe el carrito");
      }

      const productExist = cart.products.find((e) => e.code === codeProduct);

      if (productExist) {
        if (productExist.quantity > 1) {
          productExist.quantity -= 1;
        } else {
          cart.products = cart.products.filter((e) => e.code !== codeProduct);
        }

        await cart.save();
      }

      return cart;
    } catch (error) {
      console.error(error);
    }
  }

  // ... Otras funciones del carrito

  // Función para enviar la orden y actualizar el stock
  submitOrder = async (idCart, order, req) => {
    try {
      const token = req.cookies.token;
      const decodedToken = jwt.verify(token, process.env.SECRET);
      const user = await userModel.findById(decodedToken.id);

      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      const email = user.email;
      const cart = await this.getCartsById(idCart);

      if (!cart) {
        console.error("No existe el carrito");
      }

      const orderCreate = await orderModel.create({
        products: cart.products.map((product) => product._id),
        user: user.username,
      });

      const productDetails = await Promise.all(
        cart.products.map(async (cartProduct) => {
          const product = await productModel.findById(cartProduct._id);

          return {
            title: product.title,
            price: product.price,
            stock: product.stock,
            code: product.code,
            quantity: cartProduct.quantity,
          };
        })
      );

      // Envía el correo con los detalles de la compra
      await transporter.sendMail({
        from: '"Resumen de Compra" <abadiajoaquin04@gmail.com>',
        to: email,
        subject: "Resumen de Compra",
        text: "Muchas gracias por comprar en GameFusion, que disfrutes tu compra",
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
          <li>Usuario: ${user.username}</li>
        </ul>
      `,
      });

      // Actualiza el stock y vacía el carrito
      await Promise.all(
        cart.products.map(async (cartProduct) => {
          const product = await productModel.findById(cartProduct._id);

          if (product && product.stock >= cartProduct.quantity) {
            product.stock -= cartProduct.quantity;
            await product.save();
          } else {
            console.log(`No hay suficiente stock para ${cartProduct.title}`);
          }
        })
      );

      cart.products = [];
      await cart.save();

      console.log("Compra realizada con éxito");

      return cart;
    } catch (error) {
      console.error(error);
      throw new Error("Error al procesar la orden");
    }
  };
}

export default CartManager;
