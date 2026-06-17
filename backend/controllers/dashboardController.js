import Lecture from "../models/Lecture.js";

export const getAnalytics = async (req, res) => {
  try {
    const lectures = await Lecture.find({ facultyId: req.user.id });

    // SUBJECT COUNT
    const subjectMap = {};
    lectures.forEach((lec) => {
      subjectMap[lec.subject] =
        (subjectMap[lec.subject] || 0) + 1;
    });

    const subjectData = Object.keys(subjectMap).map((key) => ({
      name: key,
      value: subjectMap[key],
    }));

    // CLASS COUNT
    const classMap = {};
    lectures.forEach((lec) => {
      classMap[lec.className] =
        (classMap[lec.className] || 0) + 1;
    });

    const classData = Object.keys(classMap).map((key) => ({
      name: key,
      value: classMap[key],
    }));

    res.json({
      subjectData,
      classData,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};