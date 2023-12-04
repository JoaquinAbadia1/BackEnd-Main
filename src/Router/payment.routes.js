import { Router } from "express";
import * as dotenv from "dotenv";
import { createOrder, captureOrder, cancelOrder } from "../dao/mongo/controller/paymentController.js";
const routerPayment = Router();
dotenv.config();

routerPayment.get("/create-order", createOrder);

routerPayment.get("/capture-order", captureOrder);
routerPayment.get("/cancel-order", cancelOrder);

export default routerPayment;
