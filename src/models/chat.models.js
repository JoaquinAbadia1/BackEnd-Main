import mongoose from "mongoose";

const chatsCollection = "chats";

const chatsSchema = new mongoose.Schema({
  message: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

const chatsModel = mongoose.model(chatsCollection, chatsSchema);

export default chatsModel;
