import mongoose from "mongoose";
import EventModel from "./event.model";

export interface ClubDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  members: {
    userId: mongoose.Types.ObjectId;
    role: "officer" | "member";
    joinedAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
  getEvents(): Promise<any[]>;
}

const clubSchema = new mongoose.Schema<ClubDocument>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    members: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Method to get all events for this club
clubSchema.methods.getEvents = async function () {
  return await EventModel.find({ clubId: this._id }).populate("clubId", "name");
};

const ClubModel = mongoose.model<ClubDocument>("Club", clubSchema);

export default ClubModel;
