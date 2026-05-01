import User from "../models/user-model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  // ✅ FIX #1: process.env.JWT_SECRET use kar
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.log("REGISTER ERROR:", error.message); // ← LOG ADD KIYA
    res.status(500).json({ message: error.message });
  }
};

// login
export const loginUser = async (req, res) => {
  console.log("🔥 LOGIN HIT:", req.body); // ← LOG #1
  
  try {
    const { email, password } = req.body;
    
    console.log("🔍 Email:", email); // ← LOG #2
    
    const user = await User.findOne({ email });
    console.log("👤 User mila:", user ? user.email : "NULL"); // ← LOG #3

    if (user && (await bcrypt.compare(password, user.password))) {
      console.log("✅ LOGIN SUCCESS"); // ← LOG #4
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      console.log("❌ Invalid credentials"); // ← LOG #5
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.log("💥 LOGIN CRASH:", error.message); // ← LOG #6 - ASLI ERROR
    res.status(500).json({ message: error.message });
  }
};