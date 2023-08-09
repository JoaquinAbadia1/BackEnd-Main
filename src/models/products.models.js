import mongoose from "mongoose";

const productCollection = "Products";

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: String,
  code: {
    type: String,
    required: true,
    unique: true,
  },
  price: String,
  stock: number,
  category: String,
  tumbnails: String,
});

const productModel = mongoose.model(productCollection, productSchema);

export default productModel;
