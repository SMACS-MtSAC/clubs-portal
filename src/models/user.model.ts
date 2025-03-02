import mongoose from "mongoose";

export interface UserDocument extends mongoose.Document {
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<UserDocument>(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model<UserDocument>("User", userSchema);

export default UserModel;
