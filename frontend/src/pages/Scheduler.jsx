import { useState, useEffect } from "react";
import API from "../services/api";
import {
  FaBook,
  FaCalendarAlt,
  FaClock,
  FaUniversity,
  FaSearch,
  FaPlusCircle,
  FaClipboardList,
  FaChalkboardTeacher,
} from "react-icons/fa";

const loadLectures = () => API.get("/lectures", {
  headers: {
    Authorization: "Bearer " + localStorage.getItem("token"),
  },
});

export default function Scheduler() {
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    subject: "",
    className: "",
    duration: "",
    date: "",
    time: "",
  });

  const [lectures, setLectures] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(false);

  const fetchLectures = async () => {
    try {
      const res = await loadLectures();
      setLectures(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    let active = true;
    loadLectures()
      .then((res) => {
        if (active) setLectures(res.data);
      })
      .catch((err) => console.error("Lecture lookup failed:", err.message));

    return () => {
      active = false;
    };
  }, [token]);

  const handleSubmit = async () => {
    if (!form.subject || !form.className || !form.duration || !form.date || !form.time) {
      alert("Please fill all fields");
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (new Date(form.date) < today) {
      alert("Past dates are not allowed");
      return;
    }

    try {
      setLoading(true);

      await API.post("/lectures", form, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      alert("Lecture added successfully!");

      setForm({
        subject: "",
        className: "",
        duration: "",
        date: "",
        time: "",
      });

      fetchLectures();
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  const filteredLectures = lectures.filter((item) => {
    const matchesSearch = item.subject.toLowerCase().includes(search.toLowerCase()) || item.className.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All" || item.subject === filter;
    return matchesSearch && matchesFilter;
  });

  const totalSubjects = [...new Set(lectures.map((l) => l.subject))].length;
  const totalClasses = [...new Set(lectures.map((l) => l.className))].length;
  const todayString = new Date().toISOString().split("T")[0];
  const todayLectures = lectures.filter((l) => l.date === todayString).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100 p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-blue-700">📅 Smart Scheduler</h1>
        <p className="text-gray-600 mt-2">Organize lectures efficiently with an intelligent scheduling dashboard.</p>
      </div>

      <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-2xl shadow-xl p-6 hover:scale-105 transition">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm opacity-90">Total Lectures</p>
              <h1 className="text-4xl font-bold mt-2">{lectures.length}</h1>
            </div>
            <FaClipboardList size={45} />
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-600 to-green-500 text-white rounded-2xl shadow-xl p-6 hover:scale-105 transition">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm opacity-90">Subjects</p>
              <h1 className="text-4xl font-bold mt-2">{totalSubjects}</h1>
            </div>
            <FaBook size={45} />
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-2xl shadow-xl p-6 hover:scale-105 transition">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm opacity-90">Classes</p>
              <h1 className="text-4xl font-bold mt-2">{totalClasses}</h1>
            </div>
            <FaUniversity size={45} />
          </div>
        </div>
        <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-2xl shadow-xl p-6 hover:scale-105 transition">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm opacity-90">Today</p>
              <h1 className="text-4xl font-bold mt-2">{todayLectures}</h1>
            </div>
            <FaClock size={45} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex gap-3">
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search lectures" className="w-full md:w-72 rounded-lg border border-gray-300 px-3 py-2" />
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2">
              <option value="All">All</option>
              {[...new Set(lectures.map((l) => l.subject))].map((subject) => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>

          <button onClick={() => document.getElementById("schedule-form")?.scrollIntoView({ behavior: "smooth" })} className="rounded-lg bg-blue-600 px-4 py-2 text-white">+ Add lecture</button>
        </div>

        <div id="schedule-form" className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Subject" className="rounded-lg border border-gray-300 px-3 py-2" />
          <input value={form.className} onChange={(e) => setForm({ ...form, className: e.target.value })} placeholder="Class" className="rounded-lg border border-gray-300 px-3 py-2" />
          <input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="Duration" className="rounded-lg border border-gray-300 px-3 py-2" />
          <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="rounded-lg border border-gray-300 px-3 py-2" />
          <input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="rounded-lg border border-gray-300 px-3 py-2" />
        </div>

        <button onClick={handleSubmit} disabled={loading} className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-white disabled:opacity-60">
          {loading ? "Saving..." : "Save lecture"}
        </button>
      </div>

      <div className="mt-8 space-y-4">
        {filteredLectures.map((lecture) => (
          <div key={lecture._id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{lecture.subject}</h3>
                <p className="text-sm text-gray-500">{lecture.className}</p>
              </div>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">{lecture.duration}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-600">
              <span><FaCalendarAlt className="inline mr-1" /> {lecture.date}</span>
              <span><FaClock className="inline mr-1" /> {lecture.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
