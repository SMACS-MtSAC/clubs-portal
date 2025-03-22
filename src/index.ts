import "dotenv/config";
import express from "express";
import { NODE_ENV, PORT, MONGO_URI } from "./constants/env";
import conntectToDatabase from "./config/db";
import { errorHandler, notFound } from "./middleware/error.middleware";
import authRoutes from "./routes/auth.route";
import clubRoutes from "./routes/club.route";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send({
    status: "Healthy",
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/clubs", clubRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${NODE_ENV} environment`);
  conntectToDatabase();
});
