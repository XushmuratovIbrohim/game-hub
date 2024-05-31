import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
   {
      nickname: { type: String, required: true },
      username: { type: String, required: true, unique: true },
      passwordHash: { type: String, required: true },
      coins: { type: Number, default: 0 }
   },
   {
      timestamps: true
   }
)

export default mongoose.model('User', UserSchema)