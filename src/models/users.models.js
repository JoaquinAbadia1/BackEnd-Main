import mongoose from "mongoose";

const userCollection = "users";

const userSchema = new mongoose.Schema({
  fullName: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

const userModel = mongoose.model(userCollection, userSchema);

export default userModel;
