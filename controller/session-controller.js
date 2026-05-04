import Question from "../models/question-model.js";
import Session from "../models/session-model.js";

export const createSession = async (req, res) => {
  try {
    if (!req.user ||!req.user._id) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const { role, experience, topicsToFocus, description, questions } = req.body;
    const userId = req.user._id;

    if (!role ||!experience ||!topicsToFocus) {
      return res.status(400).json({
        success: false,
        message: "Role, experience and topics are required",
      });
    }

    const session = await Session.create({
      user: userId,
      role,
      experience,
      topicsToFocus,
      description: description || "",
    });

    let questionDocs = [];
    if (questions && questions.length > 0) {
      questionDocs = await Promise.all(
        questions.map(async (q) => {
          const question = await Question.create({
            session: session._id,
            question: q.question,
            answer: q.answer || "",
            note: q.note || "",
            isPinned: q.isPinned || false,
          });
          return question._id;
        })
      );
    }

    session.questions = questionDocs;
    await session.save();

    const populatedSession = await Session.findById(session._id).populate("questions");

    res.status(201).json({
      success: true,
      data: populatedSession,
    });
  } catch (error) {
    console.error("CREATE SESSION ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

export const getMySessions = async (req, res) => {
  try {
    if (!req.user ||!req.user._id) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated. Please login again.",
      });
    }

    const userId = req.user._id;
    const sessions = await Session.find({ user: userId })
     .sort({ createdAt: -1 })
     .populate("questions");

    res.status(200).json({
      success: true,
      count: sessions.length,
      sessions,
    });
  } catch (error) {
    console.error("GET MY SESSIONS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

export const getSessionById = async (req, res) => {
  try {
    if (!req.user ||!req.user._id) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const session = await Session.findById(req.params.id)
     .populate("questions")
     .populate("user", "name email");

    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    if (session.user._id.toString()!== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    res.status(200).json({
      success: true,
      session,
    });
  } catch (error) {
    console.error("GET SESSION BY ID ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};