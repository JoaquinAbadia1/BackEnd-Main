import mongoose from "mongoose";
import Role from "./role.models.js";

const userCollection = "users";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, max: 100 },
  email: { type: String, required: true, max: 100, unique: true },
  password: { type: String, required: true, max: 100 },
  age: { type: Number, required: true, max: 100 },
  roles: [
    {
      ref: "Role",
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
  timestamp: { type: Date, default: Date.now },
});

const userModel = mongoose.model(userCollection, userSchema);

export default userModel;
