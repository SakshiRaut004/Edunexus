import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema({
  facultyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  subject: { type: String, required: true, trim: true, maxlength: 120 },
  className: { type: String, required: true, trim: true, maxlength: 120 },
  duration: { type: Number, required: true, min: 1, max: 1440 },
  date: { type: String, required: true },
  time: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model("Lecture", lectureSchema);