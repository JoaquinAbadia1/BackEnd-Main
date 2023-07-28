import express from "express";
import productRouter from "./src/Router/products.routes.js";
import cartRouter from "./src/Router/cart.routes.js";
import viewsRouter from "./src/Router/views.routes.js";
import { engine } from "express-handlebars";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Apertura del servidor
app.get("/", (req, res) => {
  res.send("Welcome to the world with your new web app");
});

// la api de productos
app.use("/api/products", productRouter);
// la api de carrito
app.use("/api/cart", cartRouter);
// api de las views
app.use(express.static("public"));
app.use("/api/views", viewsRouter);
// handdlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

app.use(express.static("public"));
// app.use("/views", viewsRoute);

// escucha del servidor
app.listen(8080, () => console.log("Server listening on port 8080"));
