import mongoose from "mongoose";

const contentSchema = new mongoose.Schema({
  facultyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  topic: String,
  level: String,
  generatedContent: String,
  references: [String], // file URLs or names
}, { timestamps: true });

export default mongoose.model("Content", contentSchema);