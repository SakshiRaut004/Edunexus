import Lecture from "../models/Lecture.js";

export const createLecture = async (req, res) => {
  try {
    const { subject, className, duration, date, time } = req.body;
    const facultyId = req.user.id;

    // 🔥 Conflict check
    const existingLecture = await Lecture.findOne({
      className,
      date,
      time,
    });

    if (existingLecture) {
      return res.status(400).json({
        message: "Lecture already exists for this class at this time",
      });
    }

    const lecture = await Lecture.create({
      facultyId,
      subject,
      className,
      duration,
      date,
      time,
    });

    res.status(201).json(lecture);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getLectures = async (req, res) => {
  try {
    const lectures = await Lecture.find({
      facultyId: req.user.id,
    });

    res.json(lectures);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};