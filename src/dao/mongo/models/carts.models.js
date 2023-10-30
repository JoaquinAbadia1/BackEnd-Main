import mongoose from "mongoose";

const cartCollection = "carts";

const cartSchema = new mongoose.Schema({
  products: [
    {
      title: { type: String, required: true },
      price: { type: Number, required: true },
      stock: { type: Number, required: true },
      code: { type: Number, required: true },
      quantity: { type: Number, required: true, default: 1 },
    },
  ],
});

const cartModel = mongoose.model(cartCollection, cartSchema);

export default cartModel;
