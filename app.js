import express from "express";
import productRouter from "./src/Router/products.routes.js";
import cartRouter from "./src/Router/cart.routes.js";
import viewsRouter from "./src/Router/views.routes.js";
import { engine } from "express-handlebars";
import { createServer } from "http";
import __dirname from "./src/utils.js";
import { guardarProducto } from "./src/utils.js";
import { Server } from "socket.io";
import userRouter from "./src/Router/users.routes.js";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import chatRouter from "./src/Router/chat.routes.js";

dotenv.config();
const app = express();
const httpserver = createServer(app);
const PORT = 8080;
// escucha del servidor
const httpServer = app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
// Apertura del servidor
httpServer.on("error", (err) => console.log(err));
// prueba del servidor
app.get("/", (req, res) => {
  res.send("Welcome to the world with your new web app");
});

// Configurar el middleware para manejar las solicitudes JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// la api de productos
app.use("/api/products", productRouter);
// la api de carrito
app.use("/api/cart", cartRouter);
// api de las views
app.use("/api/views", viewsRouter);
//api de usuarios
app.use("/api/users", userRouter);
//api del chat
app.use("/api/chat", chatRouter);
// Configurar el directorio estático para archivos públicos
app.use(express.static("public"));

// handdlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", `${__dirname}/views`);

// Configuración del lado del servidor
const io = new Server(httpServer);
let messages = [];
// Configurar el evento de conexión de Socket.IO
io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado!");
  socket.on("new-user", (data) => {
    socket.user = data.user;
    socket.id = data.id;
    io.emit("new-user-connected", {
      user: socket.user,
      id: socket.id,
    });
  });
  socket.on("message", (data) => {
    messages.push(data);
    io.emit("messageLogs", messages);
  });

  // Escuchar evento 'agregarProducto' y emitir 'nuevoProductoAgregado'
  socket.on("agregarProducto", (newProduct) => {
    //console.log("Nuevo producto recibido backend:", newProduct);
    guardarProducto(newProduct);
    // Agregar el nuevo producto a la lista de productos
    io.emit("nuevoProductoAgregado", newProduct);
  });

  /*socket.on("productoEliminado", (productID) => {
    // Eliminar el producto de la lista en el cliente
    const productoElement = document.querySelector(`[data-id="${productID}"]`);
    if (productoElement) {
      productoElement.parentElement.remove();
    }
  });
  */

  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });
});

const MONGO_URI = process.env.MONGO_URI;

// Conexión a la base de datos
let dbConnect = mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

dbConnect.then(
  () => {
    console.log("Conexión a la base de datos exitosa");
  },
  (error) => {
    console.log("Error en la conexión a la base de datos", error);
  }
);
