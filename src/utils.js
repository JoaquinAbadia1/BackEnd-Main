import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import fs from "fs";
import mongoose from "mongoose";
import productRouter from "./Router/products.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function obtenerListaDeProductos() {
  const filePath = path.join("./products.json");
  const fileContent = fs.readFileSync(filePath, "utf8");
  const data = JSON.parse(fileContent);

  return data;
}

export function guardarProducto({
  name,
  price,
  thumbnail,
  description,
  title,
  stock,
  code,
}) {
  const filePath = path.join("./products.json");
  const fileContent = fs.readFileSync(filePath, "utf8");
  const data = JSON.parse(fileContent);

  data.push({
    name: name,
    price: price,
    thumbnail: thumbnail,
    description: description,
    title: title,
    stock: stock,
    code: code,
  });

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}
export default __dirname;
