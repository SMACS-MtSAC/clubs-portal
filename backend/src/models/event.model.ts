import mongoose from "mongoose";

export interface EventDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  posterImage: string;
  date: Date;
  location: string;
  clubId: mongoose.Types.ObjectId; // Main club organizing the event
  collaboratingClubs: string[]; // Names of other clubs collaborating
  advisors: string[];
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new mongoose.Schema<EventDocument>(
  {
    name: { type: String, required: true },
    description: { type: String },
    posterImage: { type: String },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    clubId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
      required: true,
    },
    collaboratingClubs: [String],
    advisors: [String],
  },
  {
    timestamps: true,
  }
);

const EventModel = mongoose.model<EventDocument>("Event", eventSchema);

export default EventModel;
