import nodemailer from "nodemailer";
import orderModel from "../../dao/mongo/models/order.models.js";

const html = `
<h1>Gracias por su compra</h1>
<h3>Detalles de su compra</h3>
<ul>
  <li>Producto: ${orderModel.product.name}</li>
  <li>Precio: ${orderModel.product.price}</li>
  <li>Cantidad: ${orderModel.product.quantity}</li>
`;
async function sendMail(email, html) {
    try {
        let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: ``
}