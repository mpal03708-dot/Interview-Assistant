import dotenv from "dotenv";
dotenv.config();

import Groq from "groq-sdk";
import Question from "../models/question-model.js";
import Session from "../models/session-model.js";
import {
  conceptExplainPrompt,
  questionAnswerPrompt,
} from "../utils/prompts-util.js";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// @desc Generate + SAVE interview questions for a session
export const generateInterviewQuestions = async (req, res) => {
  console.log("Groq API Call Started");
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

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: "You are an expert interview question generator. You must respond with valid JSON only. Do not include markdown, explanations, or code blocks."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const rawText = completion.choices[0].message.content;
    console.log("AI RESPONSE:", rawText);

    const parsed = JSON.parse(rawText);
    const questions = parsed.questions;

    if (!Array.isArray(questions)) {
      throw new Error("Response does not contain questions array");
    }

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
export const generateConceptExplanation = async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ success: false, message: "Question is required" });
    }

    const prompt = conceptExplainPrompt(question);

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: "You are an expert teacher. You must respond with valid JSON only. Do not include markdown or explanations outside JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const rawText = completion.choices[0].message.content;
    const explanation = JSON.parse(rawText);

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