import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

/**
 * Extract students from text
 */
const parseStudentsFromText = (text) => {
  const lines = text.split("\n");
  const students = [];

  lines.forEach((line) => {
    const nameMatch = line.match(/Name:\s*(.*?)(\||,|$)/i);
    const marksMatch = line.match(/Marks:\s*(\d+)/i);
    const gradeMatch = line.match(/Grade:\s*([A-F])/i);

    if (nameMatch && marksMatch) {
      students.push({
        _id: Math.random().toString(36).slice(2),
        name: nameMatch[1].trim(),
        total: parseInt(marksMatch[1]),
        grade: gradeMatch ? gradeMatch[1] : "N/A",
      });
    }
  });

  return students;
};

/**
 * Upload PDF → extract → return analytics data
 */
export const uploadResultsPDF = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "No PDF uploaded",
      });
    }

    const data = await pdfParse(req.file.buffer);
    const text = data.text;

    const students = parseStudentsFromText(text);

    if (!students.length) {
      return res.status(400).json({
        error: "Could not parse PDF data",
      });
    }

    return res.json(students);
  } catch (err) {
    console.error("PDF ERROR:", err);
    return res.status(500).json({
      error: "PDF processing failed",
    });
  }
};

export const getResults = async (req, res) => {
  return res.json([]);
};