import mongoose from "mongoose";
import users from "./user.models.js";
import carts from "./carts.models.js";

const oderCollection = "Orders";

const orderSchema = new mongoose.Schema({
  // products: [
  //   {
  //     ref: "Cart",
  //     type: mongoose.Schema.Types.products,
  //   },
  // ],
  user: {
    ref: "User",
    type: mongoose.Schema.Types.ObjectId,
  },
  timestamp: { type: Date, default: Date.now },
});

const orderModel = mongoose.model(oderCollection, orderSchema);

export default orderModel;
