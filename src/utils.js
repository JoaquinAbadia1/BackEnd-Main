import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import fs from "fs";

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
}) {
  const filePath = path.join(__dirname, "./products.json");
  const fileContent = fs.readFileSync(filePath, "utf8");
  const data = JSON.parse(fileContent);

  data.push({
    name: name,
    price: price,
    thumbnail: thumbnail,
    description: description,
    title: title,
  });

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}
export default __dirname;
