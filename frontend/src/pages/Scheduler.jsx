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

  // Fetch lectures
  const fetchLectures = async () => {
    try {
      const res = await API.get("/lectures", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setLectures(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchLectures();
  }, []);

  // Add Lecture
  const handleSubmit = async () => {
    if (
      !form.subject ||
      !form.className ||
      !form.duration ||
      !form.date ||
      !form.time
    ) {
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
          Authorization: `Bearer ${token}`,
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
    const matchesSearch =
      item.subject.toLowerCase().includes(search.toLowerCase()) ||
      item.className.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" || item.subject === filter;

    return matchesSearch && matchesFilter;
  });

  const totalSubjects = [
    ...new Set(lectures.map((l) => l.subject)),
  ].length;

  const totalClasses = [
    ...new Set(lectures.map((l) => l.className)),
  ].length;

  const todayString = new Date()
    .toISOString()
    .split("T")[0];

  const todayLectures = lectures.filter(
    (l) => l.date === todayString
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100 p-8">

      {/* HEADER */}

      <div className="mb-8">

        <h1 className="text-4xl font-bold text-blue-700">

          📅 Smart Scheduler

        </h1>

        <p className="text-gray-600 mt-2">

          Organize lectures efficiently with an intelligent scheduling dashboard.

        </p>

      </div>
            {/* DASHBOARD CARDS */}

      <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 mb-10">

        <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-2xl shadow-xl p-6 hover:scale-105 transition">

          <div className="flex justify-between items-center">

            <div>

              <p className="text-sm opacity-90">

                Total Lectures

              </p>

              <h1 className="text-4xl font-bold mt-2">

                {lectures.length}

              </h1>

            </div>

            <FaClipboardList size={45} />

          </div>

        </div>

        <div className="bg-gradient-to-r from-green-600 to-green-500 text-white rounded-2xl shadow-xl p-6 hover:scale-105 transition">

          <div className="flex justify-between items-center">

            <div>

              <p className="text-sm opacity-90">

                Subjects

              </p>

              <h1 className="text-4xl font-bold mt-2">

                {totalSubjects}

              </h1>

            </div>

            <FaBook size={45} />

          </div>

        </div>

        <div className="bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-2xl shadow-xl p-6 hover:scale-105 transition">

          <div className="flex justify-between items-center">

            <div>

              <p className="text-sm opacity-90">

                Classes

              </p>

              <h1 className="text-4xl font-bold mt-2">

                {totalClasses}

              </h1>

            </div>

            <FaUniversity size={45} />

          </div>

        </div>

        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl shadow-xl p-6 hover:scale-105 transition">

          <div className="flex justify-between items-center">

            <div>

              <p className="text-sm opacity-90">

                Today's Lectures

              </p>

              <h1 className="text-4xl font-bold mt-2">

                {todayLectures}

              </h1>

            </div>

            <FaCalendarAlt size={45} />

          </div>

        </div>

      </div>



      {/* SMART INSIGHT */}

      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl shadow-xl p-6 text-white mb-10">

        <h2 className="text-2xl font-bold">

          🤖 Smart Insight

        </h2>

        <p className="mt-3 text-lg">

          {todayLectures > 0
            ? `You have ${todayLectures} lecture(s) scheduled today. Stay prepared!`
            : "No lectures scheduled for today. Great opportunity for planning and content creation."}

        </p>

      </div>



      {/* ADD LECTURE */}

      <div className="bg-white rounded-3xl shadow-xl p-8">

        <h2 className="text-3xl font-bold text-gray-800 mb-6">

          ➕ Schedule a Lecture

        </h2>

        <div className="grid lg:grid-cols-2 gap-6">

          <input
            type="text"
            placeholder="Subject"
            value={form.subject}
            onChange={(e) =>
              setForm({
                ...form,
                subject: e.target.value,
              })
            }
            className="border-2 border-gray-300 rounded-xl p-4 focus:border-blue-600 outline-none"
          />

          <input
            type="text"
            placeholder="Class Name"
            value={form.className}
            onChange={(e) =>
              setForm({
                ...form,
                className: e.target.value,
              })
            }
            className="border-2 border-gray-300 rounded-xl p-4 focus:border-blue-600 outline-none"
          />

          <input
            type="number"
            placeholder="Duration (Hours)"
            value={form.duration}
            onChange={(e) =>
              setForm({
                ...form,
                duration: e.target.value,
              })
            }
            className="border-2 border-gray-300 rounded-xl p-4 focus:border-blue-600 outline-none"
          />

          <input
            type="date"
            value={form.date}
            onChange={(e) =>
              setForm({
                ...form,
                date: e.target.value,
              })
            }
            className="border-2 border-gray-300 rounded-xl p-4 focus:border-blue-600 outline-none"
          />

          <input
            type="time"
            value={form.time}
            onChange={(e) =>
              setForm({
                ...form,
                time: e.target.value,
              })
            }
            className="border-2 border-gray-300 rounded-xl p-4 focus:border-blue-600 outline-none"
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`rounded-xl text-white font-bold text-lg shadow-lg transition ${
              loading
                ? "bg-gray-400"
                : "bg-gradient-to-r from-blue-600 to-indigo-700 hover:scale-105"
            }`}
          >
            {loading ? (
              "Adding..."
            ) : (
              <div className="flex items-center justify-center gap-2 py-4">
                <FaPlusCircle />
                Add Lecture
              </div>
            )}
          </button>

        </div>

      </div>
            {/* SEARCH & FILTER */}

      <div className="bg-white rounded-3xl shadow-xl p-6 mt-10">

        <div className="grid lg:grid-cols-2 gap-5">

          <div className="flex items-center border-2 border-gray-300 rounded-xl px-4">

            <FaSearch className="text-gray-500 mr-3" />

            <input
              type="text"
              placeholder="Search by Subject or Class..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-4 outline-none"
            />

          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border-2 border-gray-300 rounded-xl p-4 outline-none"
          >

            <option value="All">

              All Subjects

            </option>

            {[...new Set(lectures.map((item) => item.subject))].map(
              (subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              )
            )}

          </select>

        </div>

      </div>



      {/* SCHEDULE LIST */}

      <div className="mt-10">

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-3xl font-bold text-gray-800">

            📚 Your Schedule

          </h2>

          <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold">

            {filteredLectures.length} Lecture(s)

          </span>

        </div>

        {filteredLectures.length === 0 ? (

          <div className="bg-white rounded-3xl shadow-xl p-16 text-center">

            <div className="text-8xl">

              📅

            </div>

            <h2 className="text-3xl font-bold mt-6 text-gray-700">

              No Lectures Found

            </h2>

            <p className="text-gray-500 mt-3">

              Create your first lecture or modify the search filters.

            </p>

          </div>

        ) : (

          <div className="grid lg:grid-cols-2 gap-6">

            {filteredLectures.map((lec) => {

              const isToday =
                lec.date === new Date().toISOString().split("T")[0];

              return (

                <div
                  key={lec._id}
                  className="bg-white rounded-3xl shadow-xl p-6 border-l-[8px] border-blue-600 hover:shadow-2xl hover:-translate-y-1 transition duration-300"
                >

                  <div className="flex justify-between items-center">

                    <div>

                      <h2 className="text-2xl font-bold text-blue-700">

                        {lec.subject}

                      </h2>

                      <p className="text-gray-500">

                        {lec.className}

                      </p>

                    </div>

                    <div>

                      {isToday ? (

                        <span className="bg-green-100 text-green-700 px-3 py-2 rounded-full font-semibold">

                          Today

                        </span>

                      ) : (

                        <span className="bg-yellow-100 text-yellow-700 px-3 py-2 rounded-full font-semibold">

                          Upcoming

                        </span>

                      )}

                    </div>

                  </div>

                  <hr className="my-4" />

                  <div className="space-y-3">

                    <div className="flex items-center gap-3">

                      <FaCalendarAlt className="text-blue-600" />

                      <span>

                        <b>Date :</b> {lec.date}

                      </span>

                    </div>

                    <div className="flex items-center gap-3">

                      <FaClock className="text-purple-600" />

                      <span>

                        <b>Time :</b> {lec.time}

                      </span>

                    </div>

                    <div className="flex items-center gap-3">

                      <FaBook className="text-green-600" />

                      <span>

                        <b>Duration :</b> {lec.duration} Hour(s)

                      </span>

                    </div>

                    <div className="flex items-center gap-3">

                      <FaUniversity className="text-orange-600" />

                      <span>

                        <b>Class :</b> {lec.className}

                      </span>

                    </div>

                  </div>

                </div>

              );

            })}

          </div>

        )}

      </div>
            {/* PRODUCTIVITY DASHBOARD */}

      <div className="mt-12 grid lg:grid-cols-3 gap-6">

        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-3xl shadow-xl p-6">

          <h2 className="text-2xl font-bold">

            📈 Weekly Productivity

          </h2>

          <div className="mt-6 space-y-4">

            <div>

              <div className="flex justify-between">

                <span>Lectures Scheduled</span>

                <span>{lectures.length}</span>

              </div>

              <div className="w-full bg-white/30 rounded-full h-3 mt-2">

                <div
                  className="bg-white h-3 rounded-full"
                  style={{
                    width: `${Math.min(
                      lectures.length * 10,
                      100
                    )}%`,
                  }}
                ></div>

              </div>

            </div>

            <div>

              <div className="flex justify-between">

                <span>Subjects Covered</span>

                <span>{totalSubjects}</span>

              </div>

              <div className="w-full bg-white/30 rounded-full h-3 mt-2">

                <div
                  className="bg-yellow-300 h-3 rounded-full"
                  style={{
                    width: `${Math.min(
                      totalSubjects * 20,
                      100
                    )}%`,
                  }}
                ></div>

              </div>

            </div>

          </div>

        </div>



        {/* SMART AI TIPS */}

        <div className="bg-white rounded-3xl shadow-xl p-6">

          <h2 className="text-2xl font-bold text-gray-800">

            🤖 Smart Suggestions

          </h2>

          <ul className="mt-5 space-y-4 text-gray-600">

            <li>

              ✅ Schedule difficult subjects during morning hours.

            </li>

            <li>

              ✅ Keep lectures between 1-2 hours for better engagement.

            </li>

            <li>

              ✅ Leave short breaks between consecutive classes.

            </li>

            <li>

              ✅ Plan revision sessions every week.

            </li>

          </ul>

        </div>



        {/* QUICK ACTIONS */}

        <div className="bg-white rounded-3xl shadow-xl p-6">

          <h2 className="text-2xl font-bold text-gray-800">

            ⚡ Quick Actions

          </h2>

          <div className="grid grid-cols-2 gap-4 mt-6">

            <button
              onClick={() =>
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                })
              }
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-4 transition"
            >
              ➕ New Lecture
            </button>

            <button
              onClick={() => {
                setSearch("");
                setFilter("All");
              }}
              className="bg-green-600 hover:bg-green-700 text-white rounded-xl p-4 transition"
            >
              🔄 Reset Filters
            </button>

            <button
              onClick={() =>
                window.print()
              }
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl p-4 transition"
            >
              🖨️ Print
            </button>

            <button
              onClick={fetchLectures}
              className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl p-4 transition"
            >
              🔃 Refresh
            </button>

          </div>

        </div>

      </div>



      {/* FOOTER */}

      <div className="mt-12 bg-gradient-to-r from-blue-700 to-purple-700 text-white rounded-3xl shadow-xl p-8 text-center">

        <h2 className="text-3xl font-bold">

          🚀 EduNexus Smart Scheduler

        </h2>

        <p className="mt-4 text-lg opacity-90">

          Helping faculty members organize lectures efficiently through an
          intelligent academic scheduling experience.

        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-4">

          <div className="bg-white/20 px-5 py-3 rounded-full">

            📅 Smart Planning

          </div>

          <div className="bg-white/20 px-5 py-3 rounded-full">

            📚 Academic Management

          </div>

          <div className="bg-white/20 px-5 py-3 rounded-full">

            🤖 AI Ready

          </div>

          <div className="bg-white/20 px-5 py-3 rounded-full">

            ⚡ Productivity

          </div>

        </div>

      </div>

    </div>

  );

}