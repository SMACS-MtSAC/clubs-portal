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
// app.use((req, res, next) => {
//   console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
//   console.log("Headers:", req.headers);
//   console.log("Body:", req.body);
//   next();
// });

// Middleware
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];
var corsOptionsDelegate = function (req: any, callback: any) {
  var corsOptions;
  if (allowedOrigins.indexOf(req.header("Origin")) !== -1) {
    corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false }; // disable CORS for this request
  }
  callback(null, corsOptions); // callback expects two parameters: error and options
};
// console.log(process.env.ALLOWED_ORIGINS?.split(","));
// app.use(
//   cors({
//     // origin: process.env.ALLOWED_ORIGINS?.split(",") || [],
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true,
//   })
// );

// Routes
app.use("/api/auth", cors(corsOptionsDelegate), authRoutes);
app.use("/api/clubs", cors(corsOptionsDelegate), clubRoutes);
app.use("/api/events", cors(corsOptionsDelegate), eventRoutes);
app.use("/api/health", cors(corsOptionsDelegate), healthRoutes);

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
