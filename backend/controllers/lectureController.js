import Lecture from "../models/Lecture.js";

const lectureFields = ["subject", "className", "duration", "date", "time"];

const validateLecture = (body, partial = false) => {
  const values = {};

  for (const field of lectureFields) {
    if (!Object.hasOwn(body, field)) {
      if (!partial) return { error: "All lecture fields are required" };
      continue;
    }

    if (field === "duration") {
      const duration = Number(body.duration);
      if (!Number.isFinite(duration) || duration < 1 || duration > 1440) {
        return { error: "Duration must be between 1 and 1,440 minutes" };
      }
      values.duration = duration;
      continue;
    }

    if (typeof body[field] !== "string") {
      return { error: `${field} must be a string` };
    }

    const value = body[field].trim();
    if (!value) return { error: `${field} is required` };
    if ((field === "subject" || field === "className") && value.length > 120) {
      return { error: `${field} cannot exceed 120 characters` };
    }
    if (field === "date" && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return { error: "Date must use YYYY-MM-DD format" };
    }
    if (field === "time" && !/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) {
      return { error: "Time must use 24-hour HH:MM format" };
    }

    values[field] = value;
  }

  if (values.date) {
    const parsedDate = new Date(`${values.date}T00:00:00.000Z`);
    if (Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== values.date) {
      return { error: "Enter a valid date" };
    }
  }

  return { values };
};

const handleLectureError = (res, error, message) => {
  console.error(`${message}:`, error.message);
  if (error.name === "CastError" || error.name === "ValidationError") {
    return res.status(400).json({ message: "Invalid lecture data" });
  }
  return res.status(500).json({ message: "Unable to process lecture" });
};

export const createLecture = async (req, res) => {
  try {
    const { values, error: validationError } = validateLecture(req.body || {});
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const facultyId = req.user.id;

    const existingLecture = await Lecture.findOne({
      facultyId,
      className: values.className,
      date: values.date,
      time: values.time,
    });

    if (existingLecture) {
      return res.status(409).json({
        message: "Lecture already exists for this class at this time",
      });
    }

    const lecture = await Lecture.create({
      facultyId,
      ...values,
    });

    return res.status(201).json(lecture);
  } catch (error) {
    return handleLectureError(res, error, "Lecture creation failed");
  }
};


export const getLectures = async (req, res) => {
  try {
    const lectures = await Lecture.find({
      facultyId: req.user.id,
    }).sort({ date: 1, time: 1 });

    return res.json(lectures);
  } catch (error) {
    return handleLectureError(res, error, "Lecture lookup failed");
  }
};

export const updateLecture = async (req, res) => {
  try {
    const { values, error: validationError } = validateLecture(req.body || {}, true);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }
    if (!Object.keys(values).length) {
      return res.status(400).json({ message: "Provide at least one lecture field to update" });
    }

    const query = { _id: req.params.id, facultyId: req.user.id };
    const lecture = await Lecture.findOne(query);
    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    const nextValues = { ...lecture.toObject(), ...values };
    const conflictingLecture = await Lecture.findOne({
      _id: { $ne: lecture._id },
      facultyId: req.user.id,
      className: nextValues.className,
      date: nextValues.date,
      time: nextValues.time,
    });
    if (conflictingLecture) {
      return res.status(409).json({ message: "Lecture already exists for this class at this time" });
    }

    Object.assign(lecture, values);
    return res.json(await lecture.save());
  } catch (error) {
    return handleLectureError(res, error, "Lecture update failed");
  }
};

export const deleteLecture = async (req, res) => {
  try {
    const lecture = await Lecture.findOneAndDelete({
      _id: req.params.id,
      facultyId: req.user.id,
    });
    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }
    return res.json({ message: "Lecture deleted" });
  } catch (error) {
    return handleLectureError(res, error, "Lecture deletion failed");
  }
};