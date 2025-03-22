import bcrypt from "bcryptjs";
import mongoose from "mongoose";

export interface UserDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  username: string;
  password: string;
  role: "admin" | "club_officer";
  clubId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  matchPasswords: (enteredPassword: string) => Promise<boolean>;
}

const userSchema = new mongoose.Schema<UserDocument>(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "club_officer"],
      default: "club_officer",
    },
    clubId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
      required: function (this: UserDocument) {
        return this.role === "club_officer";
      },
    },
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
