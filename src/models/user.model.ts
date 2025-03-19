import bcrypt from "bcryptjs";
import mongoose from "mongoose";

export interface UserDocument extends mongoose.Document {
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  matchPasswords: (enteredPassword: string) => Promise<boolean>;
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

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPasswords = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const UserModel = mongoose.model<UserDocument>("User", userSchema);

export default UserModel;
