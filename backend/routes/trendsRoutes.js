import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import fetch from "node-fetch";

const router = express.Router();

/**
 * @route   GET /api/trends/news
 * @desc    Fetch education news (India + World)
 * @access  Private
 */
router.get("/news", protect, async (req, res) => {
  try {
    const API_KEY = process.env.NEWS_API_KEY;

    if (!API_KEY) {
      return res.status(500).json({
        error: "NEWS_API_KEY not configured in environment variables",
      });
    }

    // Fetch India-focused education news
    const indiaResponse = await fetch(
      `https://newsapi.org/v2/everything?q=education%20india&language=en&pageSize=10&apiKey=${API_KEY}`
    );

    // Fetch global education news
    const worldResponse = await fetch(
      `https://newsapi.org/v2/everything?q=education&language=en&pageSize=10&apiKey=${API_KEY}`
    );

    const indiaData = await indiaResponse.json();
    const worldData = await worldResponse.json();

    return res.json({
      india: indiaData.articles || [],
      world: worldData.articles || [],
    });
  } catch (error) {
    console.error("Trends API Error:", error);
    return res.status(500).json({
      error: "Failed to fetch trends news",
    });
  }
});

export default router;