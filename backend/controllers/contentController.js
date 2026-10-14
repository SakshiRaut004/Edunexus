import { GoogleGenerativeAI } from "@google/generative-ai";
import Content from "../models/Content.js";

export const generateContent = async (req, res) => {
  try {
    const body = req.body && typeof req.body === "object" && !Array.isArray(req.body) ? req.body : {};
    const topic = typeof body.topic === "string" ? body.topic.trim() : "";
    const requestedLevel = body.level;
    const levels = ["Beginner", "Intermediate", "Advanced"];
    const level = levels.includes(requestedLevel) ? requestedLevel : "Beginner";

    if (!topic || topic.length > 200) {
      return res.status(400).json({ error: "Topic must be between 1 and 200 characters" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({ error: "AI content generation is not configured" });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
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
    console.error("AI content generation failed:", error.message);
    res.status(502).json({ error: "AI content generation failed. Please try again." });
  }
};


// SAVE CONTENT
export const saveContent = async (req, res) => {
  try {
    const body = req.body && typeof req.body === "object" && !Array.isArray(req.body) ? req.body : {};
    const { topic, level, generatedContent } = body;
    const normalizedTopic = typeof topic === "string" ? topic.trim() : "";
    const normalizedContent = typeof generatedContent === "string" ? generatedContent.trim() : "";

    if (!normalizedTopic || normalizedTopic.length > 200 || !normalizedContent || normalizedContent.length > 30000) {
      return res.status(400).json({ error: "Provide a topic and content within the allowed limits" });
    }

    const content = await Content.create({
      facultyId: req.user.id,
      topic: normalizedTopic,
      level: ["Beginner", "Intermediate", "Advanced"].includes(level) ? level : "Beginner",
      generatedContent: normalizedContent,
    });

    return res.status(201).json(content);
  } catch (error) {
    console.error("Saved content creation failed:", error.message);
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({ error: "Invalid content data" });
    }
    return res.status(500).json({ error: "Unable to save content" });
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
    console.error("Saved content lookup failed:", error.message);
    res.status(500).json({ error: "Unable to load saved content" });
  }
};

export const updateContent = async (req, res) => {
  const updates = {};
  const body = req.body && typeof req.body === "object" && !Array.isArray(req.body) ? req.body : {};
  const { topic, level, generatedContent } = body;

  if (Object.hasOwn(body, "topic")) {
    if (typeof topic !== "string" || !topic.trim() || topic.trim().length > 200) {
      return res.status(400).json({ error: "Topic must be between 1 and 200 characters" });
    }
    updates.topic = topic.trim();
  }

  if (Object.hasOwn(body, "level")) {
    if (!["Beginner", "Intermediate", "Advanced"].includes(level)) {
      return res.status(400).json({ error: "Choose a valid difficulty level" });
    }
    updates.level = level;
  }

  if (Object.hasOwn(body, "generatedContent")) {
    if (typeof generatedContent !== "string" || !generatedContent.trim() || generatedContent.trim().length > 30000) {
      return res.status(400).json({ error: "Content must be between 1 and 30,000 characters" });
    }
    updates.generatedContent = generatedContent.trim();
  }

  if (!Object.keys(updates).length) {
    return res.status(400).json({ error: "Provide content fields to update" });
  }

  try {
    const content = await Content.findOneAndUpdate(
      { _id: req.params.id, facultyId: req.user.id },
      { $set: updates },
      { new: true, runValidators: true }
    );
    if (!content) {
      return res.status(404).json({ error: "Saved content not found" });
    }
    return res.json(content);
  } catch (error) {
    console.error("Saved content update failed:", error.message);
    if (error.name === "CastError" || error.name === "ValidationError") {
      return res.status(400).json({ error: "Invalid content data" });
    }
    return res.status(500).json({ error: "Unable to update saved content" });
  }
};

export const deleteContent = async (req, res) => {
  try {
    const content = await Content.findOneAndDelete({
      _id: req.params.id,
      facultyId: req.user.id,
    });
    if (!content) {
      return res.status(404).json({ error: "Saved content not found" });
    }
    return res.json({ message: "Saved content deleted" });
  } catch (error) {
    console.error("Saved content deletion failed:", error.message);
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid content id" });
    }
    return res.status(500).json({ error: "Unable to delete saved content" });
  }
};
