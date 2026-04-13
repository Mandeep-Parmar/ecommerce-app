import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    cartData: {
      type: Object,
      default: {},
    },
  },

  //   By default: Empty objects {} are removed, With this: Keeps empty cart {} in DB
  { minimize: false },
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
