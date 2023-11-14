import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productCollection = "Products";

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: String,
  code: {
    type: Number,
    required: true,
    unique: true,
  },
  price: String,
  stock: Number,
  category: String,
  thumbnail: String,

  timestamp: { type: Date, default: Date.now },
});

productSchema.plugin(mongoosePaginate);
const productModel = mongoose.model(productCollection, productSchema);

export default productModel;
