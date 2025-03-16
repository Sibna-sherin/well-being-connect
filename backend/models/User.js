import mongoose from "mongoose";
//schema definition
const userSchema=new mongoose.Schema({name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "doctor", "admin"], default: "user" }})
//user model is created
    const User = mongoose.model("User", userSchema);

export default User;