import dotenv from "dotenv";
dotenv.config();

import { GoogleGenerativeAI } from "@google/generative-ai";
import Question from "../models/question-model.js";
import Session from "../models/session-model.js";
import {
  conceptExplainPrompt,
  questionAnswerPrompt,
} from "../utils/prompts-util.js";

// CHANGE 1: apiVersion add kar diya
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY, {
  apiVersion: "v1"
});

// @desc Generate + SAVE interview questions for a session
// @route POST /api/ai/generate-questions
// @access Private
export const generateInterviewQuestions = async (req, res) => {
  console.log("hi");
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ success: false, message: "sessionId is required" });
    }

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    if (session.user.toString()!== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const { role, experience, topicsToFocus } = session;
    console.log("session: ", session);

    const prompt = questionAnswerPrompt(role, experience, topicsToFocus, 10);

    // CHANGE 2: Model name fix kar diya
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const rawText = response.text();

    console.log("AI RESPONSE:", rawText);

    const cleanedText = rawText
    .replace(/^```json\s*/, "")
    .replace(/^```\s*/, "")
    .replace(/```$/, "")
    .replace(/^json\s*/, "")
    .trim();

    let questions;
    try {
      questions = JSON.parse(cleanedText);
    } catch {
      const jsonMatch = cleanedText.match(/\[[\s\S]*\]/);
      if (jsonMatch) questions = JSON.parse(jsonMatch[0]);
      else throw new Error("Failed to parse AI response as JSON");
    }

    if (!Array.isArray(questions)) throw new Error("Response is not an array");

    const saved = await Question.insertMany(
      questions.map((q) => ({
        session: sessionId,
        question: q.question,
        answer: q.answer || "",
        note: "",
        isPinned: false,
      })),
    );

    session.questions.push(...saved.map((q) => q._id));
    await session.save();

    const updatedSession = await Session.findById(sessionId).populate("questions");
    res.status(201).json({ success: true, session: updatedSession });

  } catch (error) {
    console.error("AI ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate questions",
      error: error.message,
    });
  }
};

// @desc Generate explanation for an interview question
// @route POST /api/ai/generate-explanation
// @access Private
export const generateConceptExplanation = async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ success: false, message: "Question is required" });
    }

    const prompt = conceptExplainPrompt(question);

    // CHANGE 3: Yahan bhi model name fix kar diya
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const rawText = result.response.text();

    const cleanedText = rawText
    .replace(/^```json\s*/, "")
    .replace(/^```\s*/, "")
    .replace(/```$/, "")
    .replace(/^json\s*/, "")
    .trim();

    let explanation;
    try {
      explanation = JSON.parse(cleanedText);
    } catch (parseError) {
      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        explanation = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Failed to parse AI response as JSON");
      }
    }

    if (!explanation.title ||!explanation.explanation) {
      throw new Error("Response missing required fields: title and explanation");
    }

    res.status(200).json({ success: true, data: explanation });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to generate explanation",
      error: error.message,
    });
  }
};

export const getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id).populate("questions");
    if (!session) return res.status(404).json({ success: false, message: "Session not found" });
    res.status(200).json({ success: true, session });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};