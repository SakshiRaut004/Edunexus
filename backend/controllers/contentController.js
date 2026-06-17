import { GoogleGenerativeAI } from "@google/generative-ai";
import Content from "../models/Content.js";

//const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const genAI = new GoogleGenerativeAI("AIzaSyBjGaE8ss7dvEFRmkyF0plC1m_zQ3qtlec");

/*export const generateContent = async (req, res) => {
  try {
    const { topic, level } = req.body;

    console.log("BODY:", req.body);
    console.log("API KEY:", process.env.GEMINI_API_KEY ? "Loaded" : "Missing");

    if (!topic) {
      return res.status(400).json({ error: "Topic is required" });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
    });

    const prompt = `
    Create structured lecture notes for:
    Topic: ${topic}
    Difficulty: ${level}

    Include:
    - Introduction
    - Key Concepts
    - Examples
    - Summary
    `;

    const result = await model.generateContent(prompt);

    const text = result.response.text(); // ✅ FIXED

    res.json({ content: text });

  } catch (error) {
    console.log("GEMINI ERROR:", error.message);
    res.status(500).json({ error: error.message });
  }
};
*/
export const generateContent = async (req, res) => {
  try {
    const { topic, level } = req.body;

    if (!topic) {
      return res.status(400).json({ error: "Topic is required" });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash", // ✅ ONLY reliable one for this SDK
    });

    const result = await model.generateContent(
      `Create structured lecture notes for:
      Topic: ${topic}
      Difficulty: ${level}

      Include:
      - Introduction
      - Key Concepts
      - Examples
      - Summary`
    );

    const text = result.response.text();

    res.json({ content: text });

  } catch (error) {
    console.error("GEMINI FULL ERROR:", error);

    res.status(500).json({
      error: error.message,
    });
  }
};


// SAVE CONTENT
export const saveContent = async (req, res) => {
  try {
    const { topic, level, generatedContent } = req.body;

    const content = await Content.create({
      facultyId: req.user.id,
      topic,
      level,
      generatedContent,
    });

    res.json(content);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ALL CONTENT
export const getAllContent = async (req, res) => {
  try {
    const contents = await Content.find({
      facultyId: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(contents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//import { GoogleGenerativeAI } from "@google/generative-ai";

//const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

