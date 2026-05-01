import dotenv from "dotenv";
dotenv.config({ quiet: true });

import path from "node:path";
import cors from "cors";
import express from "express";
import { connectDB } from "./config/database-config.js";

import {
  generateConceptExplanation,
  generateInterviewQuestions,
} from "./controller/ai-controller.js";
import { protect } from "./middlewares/auth-middleware.js";
import authRoutes from "./routes/auth-route.js";
import authSessions from "./routes/session-route.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://ai-interview-prep-kwfpbg3d0-sarveshs-projects-eba40f12.vercel.app",
  "https://ai-interview-prep-app-git-main-sarveshs-projects-eba40f12.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Access-Control-Allow-Origin",
    ],
  }),
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/sessions", authSessions);

app.post("/api/ai/generate-questions", protect, generateInterviewQuestions);
app.post("/api/ai/generate-explanation", protect, generateConceptExplanation);

app.use(
  "/uploads",
  express.static(path.join(import.meta.dirname, "uploads"), {}),
);

// YAHAN CHANGE KIYA HAI 👇
const startServer = async () => {
  try {
    await connectDB(); // Pehle DB connect karo
    app.listen(process.env.PORT, () => {
      console.log("Server running at port", process.env.PORT);
    });
  } catch (error) {
    console.log("Failed to start server:", error);
  }
};

startServer();