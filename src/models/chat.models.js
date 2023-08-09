import mongoose from "mongoose";

const chatsCollection = "chats";

const chatsSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  message: String,
});

const chatsModel = mongoose.model(chatsCollection, chatsSchema);

export default chatsModel;
