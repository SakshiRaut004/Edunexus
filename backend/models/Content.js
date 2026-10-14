import mongoose from "mongoose";

const contentSchema = new mongoose.Schema({
  facultyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  topic: { type: String, required: true, trim: true, maxlength: 200 },
  level: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], default: "Beginner" },
  generatedContent: { type: String, required: true, maxlength: 30000 },
  references: [String], // file URLs or names
}, { timestamps: true });

export default mongoose.model("Content", contentSchema);