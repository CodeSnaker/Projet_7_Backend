import { Schema } from "mongoose";

const mongoose = require("mongoose");

const userSchema = new Schema({
    email: String,
    password: String,
});

const User = mongoose.model("User", userSchema);

export default User;
