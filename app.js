import express from "express";
import productRouter from "./src/Router/products.routes.js";
import cartRouter from "./src/Router/cart.routes.js";
import viewsRouter from "./src/Router/views.routes.js";
import { engine } from "express-handlebars";
import { createServer } from "http";
import __dirname from "./src/utils.js";
import { Server } from "socket.io";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import Message from "./src/models/chat.models.js";
import homeRouter from "./src/Router/home.routes.js";
import productModel from "./src/models/products.models.js";
import usersRouter from "./src/Router/user.routes.js";
import sessionRouter from "./src/Router/session.routes.js";
import MongoStore from "connect-mongo";
import session from "express-session";
import passport from "passport";
import initializePassport from "./src/config/passport.config.js";

dotenv.config();
const app = express();
const httpserver = createServer(app);
const PORT = process.env.PORT;
// escucha del servidor
const httpServer = app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
// Apertura del servidor
httpServer.on("error", (err) => console.log(err));

// Configurar el middleware para manejar las solicitudes JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//home page
app.use("/", homeRouter);
// la api de productos
app.use("/api/products", productRouter);
// la api de carrito
app.use("/api/cart", cartRouter);
// api de las views
app.use("/api/views", viewsRouter);
//api de users
app.use("/api/users", usersRouter);
//api de sesiones
app.use("/api/sessions", sessionRouter);

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
  //console.log("Nuevo cliente conectado!");

  socket.on("chat message", async (msg) => {
    // Crea un nuevo mensaje y guárdalo en la base de datos
    const message = new Message({ content: msg });
    await message.save();
  });

  socket.on("message", (data) => {
    messages.push(data);
    io.emit("messageLogs", messages);
  });

  // Escuchar evento 'agregarProducto' y emitir 'nuevoProductoAgregado'
  socket.on("agregarProducto", async (newProduct) => {
    //console.log("Nuevo producto recibido backend:", newProduct);
    const product = new productModel(newProduct);
    const productSave = await product.save();
    console.log(productSave);
    // Agregar el nuevo producto a la lista de productos
    io.emit("nuevoProductoAgregado", newProduct);
  });
  socket.on("disconnect", () => {
    //console.log("Cliente desconectado");
  });
});

// Conexión a la base de datos
const MONGO_URI = process.env.MONGO_URI;
let dbConnect = mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.set("strictQuery", true);

dbConnect.then(
  () => {
    console.log("Conexión a la base de datos exitosa");
  },
  (error) => {
    console.log("Error en la conexión a la base de datos", error);
  }
);

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: MONGO_URI,
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      ttl: 30,
    }),
    secret: "codersecret",
    resave: false,
    saveUninitialized: false,
  })
);
initializePassport();
app.use(passport.initialize());
app.use(passport.session());
