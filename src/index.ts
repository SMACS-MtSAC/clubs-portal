import "dotenv/config";
import express from "express";
import { NODE_ENV, PORT, MONGO_URI } from "./constants/env";
import conntectToDatabase from "./config/db";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send({
    status: "Healthy",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${NODE_ENV} environment`);
  conntectToDatabase();
});
