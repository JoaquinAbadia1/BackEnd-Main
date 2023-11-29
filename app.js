// dependencias externas
import express from "express";
import { Server } from "socket.io";
import * as dotenv from "dotenv";
import MongoStore from "connect-mongo";
import session from "express-session";
import passport from "passport";
import mongoose from "mongoose";
import { createServer } from "http";
import { engine } from "express-handlebars";
import cookieParser from "cookie-parser";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";
import cors from "cors";
import "localstorage-polyfill";
// mis dependencias locales
import productRouter from "./src/Router/products.routes.js";
import cartRouter from "./src/Router/cart.routes.js";
import viewsRouter from "./src/Router/views.routes.js";
import __dirname, { createRoles } from "./src/utils.js";
import Message from "./src/dao/mongo/models/chat.models.js";
import homeRouter from "./src/Router/home.routes.js";
import productModel from "./src/dao/mongo/models/products.models.js";
import sessionRouter from "./src/Router/session.routes.js";
import userRouter from "./src/Router/user.routes.js";
import initializePassport from "./src/config/passport.config.js";
import MongoSingleton from "./src/services/MongoSingleton.js";
import compression from "express-compression";
import errorHandle from "./src/middlewares/errors.js";

dotenv.config();
const app = express();
createRoles();

const httpserver = createServer(app);
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;
// escucha del servidor
const httpServer = app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
// Apertura del servidor
httpServer.on("error", (err) => console.log(err));

//session con mongo
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: MONGO_URI,
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      ttl: 100,
    }),
    secret: "codersecret",
    resave: false,
    saveUninitialized: false,
  })
);
mongoose.set("strictQuery", false);
initializePassport();
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(cors());
//SwaggerOptions
const SwaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Documentacion del poder",
      description: "y del saber",
    },
  },
  apis: [`${__dirname}/docs/**/*.yaml`],
};

//conectamos Swagger
const specs = swaggerJsdoc(SwaggerOptions);

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
//api de sesiones
app.use("/api/sessions", sessionRouter);
//api de usuarios
app.use("/api/users", userRouter);
//swagger
app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

// Configurar el directorio estático para archivos públicos
app.use(express.static("public"));
//usar compresion
app.use(compression());

// handdlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", `${__dirname}/views`);
//manejo de errores
app.use(errorHandle);
function getUserNameFromToken(token) {
  try {
    const decoded = jwt.verify(token, "tu-secreto");
    return decoded.username;
  } catch (error) {
    return null;
  }
}

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
