import "dotenv/config";
import express from "express";
import { NODE_ENV, PORT, MONGO_URI } from "./constants/env";
import conntectToDatabase from "./config/db";
import UserModel from "./models/user.model";
import authRoutes from "./routes/auth.route";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send({
    status: "Healthy",
  });
});

app.use("/", authRoutes);
// app.post("/api/users", async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     const newUser = new UserModel({
//       username,
//       password,
//     });

//     const savedUser = await newUser.save();
//     res.status(201).json(savedUser);
//   } catch (error) {
//     res.status(500).json({ message: `Error creating the user`, error: error });
//   }
// });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${NODE_ENV} environment`);
  conntectToDatabase();
});
