import mongoose from "mongoose";
import users from "./user.models.js";
import carts from "./carts.models.js";

const oderCollection = "Orders";

const orderSchema = new mongoose.Schema({
  products: [
    {
      ref: "carts",
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
  user: { type: String, required: true },

  timestamp: { type: Date, default: Date.now },
});

const orderModel = mongoose.model(oderCollection, orderSchema);

export default orderModel;
