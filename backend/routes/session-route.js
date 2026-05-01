import { protect } from "../middlewares/auth-middleware.js";
import express from "express";
import {
  createSession,
  getMySessions,
  getSessionById,
} from "../controller/session-controller.js";

const router = express.Router();

router.post("/create", protect, createSession);
router.get("/my-sessions", protect, getMySessions);
router.get("/:id", protect, getSessionById);


export default router;
