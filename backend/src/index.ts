import "dotenv/config";
import express from "express";
import cors from "cors";
import { NODE_ENV, PORT, MONGO_URI } from "./constants/env";
import conntectToDatabase from "./config/db";
import { errorHandler, notFound } from "./middleware/error.middleware";
import authRoutes from "./routes/auth.route";
import clubRoutes from "./routes/club.route";
import eventRoutes from "./routes/event.route";
import healthRoutes from "./routes/health.route";
import cookieParser from "cookie-parser";

const app = express();

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  next();
});

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/clubs", clubRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/health", healthRoutes);

app.get("/", (req, res) => {
  res.send({
    status: "Healthy",
  });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${NODE_ENV} environment`);
  conntectToDatabase();
});
