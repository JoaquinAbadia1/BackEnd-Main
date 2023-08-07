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
app.use("/api/views/products", viewsRouter);
//api de usuarios
app.use("/api/users", userRouter);
// Configurar el directorio estático para archivos públicos
app.use(express.static("public"));

// handdlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", `${__dirname}/views`);

// Configuración del lado del servidor
const io = new Server(httpServer);

// Configurar el evento de conexión de Socket.IO
io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  // Manejar eventos personalizados
  socket.on("mensaje", (data) => {
    console.log("Mensaje recibido:", data);

    // Enviar una respuesta al cliente
    socket.emit("respuesta", "Mensaje recibido correctamente");
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
