import mongoose from "mongoose";
import { NODE_ENV, MONGO_URI, MONGO_URI_DEVELOPMENT } from "../constants/env";

const conntectToDatabase = async () => {
  console.log("trying to connect to DB");
  try {
    await mongoose.connect(
      NODE_ENV === "production" ? MONGO_URI : MONGO_URI_DEVELOPMENT
    );
    console.log("Successfully connected to DB");
  } catch (error) {
    console.error("Could not connect to DB", error);
    process.exit(1);
  }
};
export default conntectToDatabase;
