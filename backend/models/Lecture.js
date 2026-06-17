import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema({
  facultyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  subject: String,
  className: String,
  duration: Number,
  date: String,
  time: String,
}, { timestamps: true });

export default mongoose.model("Lecture", lectureSchema);