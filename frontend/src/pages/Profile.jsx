import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaUniversity,
  FaUserTie,
  FaEdit,
  FaCamera,
  FaGraduationCap,
  FaBook,
  FaCalendarAlt,
  FaClock,
  FaAward,
} from "react-icons/fa";

export default function Profile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    role: "Faculty",
    school: "EduNexus",
    department: "Computer Science",
    bio: "",
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser) {
      setProfile({
        name: storedUser.name || "Faculty Member",
        email: storedUser.email || "",
        role: storedUser.role || "Faculty",
        school: storedUser.school || "EduNexus",
        department:
          storedUser.department || "Computer Science",
        bio:
          storedUser.bio ||
          "Dedicated educator committed to delivering quality education through innovative teaching methodologies.",
      });
    }
  }, []);

  const handleChange = (e) => {
    const updatedProfile = {
      ...profile,
      [e.target.name]: e.target.value,
    };

    setProfile(updatedProfile);

    localStorage.setItem(
      "user",
      JSON.stringify(updatedProfile)
    );
  };

  const stats = [
    {
      title: "Courses",
      value: "12",
      icon: <FaBook className="text-2xl" />,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Lectures",
      value: "148",
      icon: <FaCalendarAlt className="text-2xl" />,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Hours",
      value: "520",
      icon: <FaClock className="text-2xl" />,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Rating",
      value: "4.9",
      icon: <FaAward className="text-2xl" />,
      color: "bg-yellow-100 text-yellow-600",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-100 p-6"
    >
      <div className="max-w-7xl mx-auto">

        {/* Header */}

        <div className="mb-8">

          <h1 className="text-4xl font-bold text-gray-800">
            Faculty Profile
          </h1>

          <p className="text-gray-500 mt-2">
            Manage your personal information and
            academic profile.
          </p>

        </div>

        {/* Main Card */}

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

          {/* Banner */}

          <div className="h-40 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>

          <div className="px-8 pb-8">

            <div className="flex flex-col lg:flex-row gap-8">

              {/* Left Section */}

              <div className="lg:w-1/3 flex flex-col items-center -mt-16">

                <div className="relative">

                  <div className="w-36 h-36 rounded-full bg-white shadow-xl flex items-center justify-center border-4 border-white">

                    <span className="text-6xl font-bold text-blue-600">
                      {profile.name
                        ? profile.name.charAt(0).toUpperCase()
                        : "F"}
                    </span>

                  </div>

                  <button
                    className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700"
                  >
                    <FaCamera />
                  </button>

                </div>

                <h2 className="text-3xl font-bold mt-5 text-gray-800">
                  {profile.name}
                </h2>

                <p className="text-blue-600 font-semibold mt-1">
                  {profile.role}
                </p>

                <div className="mt-5 flex items-center gap-2 text-gray-600">

                  <FaUniversity />

                  <span>{profile.school}</span>

                </div>

                <div className="mt-2 flex items-center gap-2 text-gray-600">

                  <FaGraduationCap />

                  <span>{profile.department}</span>

                </div>
                                {/* Quick Stats */}

                <div className="grid grid-cols-2 gap-4 mt-8 w-full">

                  {stats.map((item, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      className={`${item.color} rounded-xl p-4 shadow text-center`}
                    >
                      <div className="flex justify-center mb-2">
                        {item.icon}
                      </div>

                      <h2 className="text-2xl font-bold">
                        {item.value}
                      </h2>

                      <p className="text-sm">
                        {item.title}
                      </p>
                    </motion.div>
                  ))}

                </div>

              </div>

              {/* Right Section */}

              <div className="flex-1">

                <div className="flex items-center gap-2 mb-6">

                  <FaEdit className="text-blue-600" />

                  <h2 className="text-2xl font-bold text-gray-800">
                    Edit Profile
                  </h2>

                </div>

                <div className="grid md:grid-cols-2 gap-5">

                  {/* Name */}

                  <div>

                    <label className="text-sm text-gray-500 flex items-center gap-2 mb-2">

                      <FaUser />

                      Full Name

                    </label>

                    <input
                      type="text"
                      name="name"
                      value={profile.name}
                      onChange={handleChange}
                      className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-400 outline-none"
                    />

                  </div>

                  {/* Email */}

                  <div>

                    <label className="text-sm text-gray-500 flex items-center gap-2 mb-2">

                      <FaEnvelope />

                      Email Address

                    </label>

                    <input
                      type="text"
                      value={profile.email}
                      readOnly
                      className="w-full border rounded-xl p-3 bg-gray-100 cursor-not-allowed"
                    />

                  </div>

                  {/* Role */}

                  <div>

                    <label className="text-sm text-gray-500 flex items-center gap-2 mb-2">

                      <FaUserTie />

                      Role

                    </label>

                    <input
                      type="text"
                      name="role"
                      value={profile.role}
                      onChange={handleChange}
                      className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-purple-400 outline-none"
                    />

                  </div>

                  {/* Organization */}

                  <div>

                    <label className="text-sm text-gray-500 flex items-center gap-2 mb-2">

                      <FaUniversity />

                      Organization

                    </label>

                    <input
                      type="text"
                      name="school"
                      value={profile.school}
                      onChange={handleChange}
                      className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-green-400 outline-none"
                    />

                  </div>

                  {/* Department */}

                  <div className="md:col-span-2">

                    <label className="text-sm text-gray-500 flex items-center gap-2 mb-2">

                      <FaGraduationCap />

                      Department

                    </label>

                    <input
                      type="text"
                      name="department"
                      value={profile.department}
                      onChange={handleChange}
                      className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-indigo-400 outline-none"
                    />

                  </div>
                                    {/* Bio */}

                  <div className="md:col-span-2">

                    <label className="text-sm text-gray-500 flex items-center gap-2 mb-2">

                      <FaEdit />

                      Bio

                    </label>

                    <textarea
                      rows={5}
                      name="bio"
                      value={profile.bio}
                      onChange={handleChange}
                      className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-400 outline-none resize-none"
                    />

                  </div>

                </div>

                {/* Save Button */}

                <div className="mt-8">

                  <button
                    onClick={() =>
                      alert("Profile updated successfully!")
                    }
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl shadow-lg hover:scale-105 transition duration-300"
                  >
                    Save Changes
                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* Dashboard Cards */}

        <div className="grid lg:grid-cols-3 gap-6 mt-8">

          {/* Teaching Overview */}

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >

            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Teaching Overview
            </h2>

            <div className="space-y-4">

              <div className="flex justify-between">

                <span className="text-gray-600">
                  Assigned Courses
                </span>

                <span className="font-bold text-blue-600">
                  12
                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-gray-600">
                  Scheduled Lectures
                </span>

                <span className="font-bold text-green-600">
                  148
                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-gray-600">
                  Students
                </span>

                <span className="font-bold text-purple-600">
                  326
                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-gray-600">
                  Attendance
                </span>

                <span className="font-bold text-orange-600">
                  94%
                </span>

              </div>

            </div>

          </motion.div>

          {/* AI Usage */}

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >

            <h2 className="text-xl font-bold text-gray-800 mb-4">
              AI Productivity
            </h2>

            <div className="space-y-4">

              <div className="flex justify-between">

                <span className="text-gray-600">
                  Notes Generated
                </span>

                <span className="font-bold text-blue-600">
                  58
                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-gray-600">
                  Lesson Plans
                </span>

                <span className="font-bold text-green-600">
                  34
                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-gray-600">
                  AI Sessions
                </span>

                <span className="font-bold text-purple-600">
                  112
                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-gray-600">
                  Time Saved
                </span>

                <span className="font-bold text-red-600">
                  41 hrs
                </span>

              </div>

            </div>

          </motion.div>

          {/* Account Status */}

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >

            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Account Status
            </h2>

            <div className="space-y-5">

              <div>

                <p className="text-gray-500 text-sm">
                  Membership
                </p>

                <h3 className="font-bold text-green-600">
                  Active
                </h3>

              </div>

              <div>

                <p className="text-gray-500 text-sm">
                  Role
                </p>

                <h3 className="font-bold">
                  {profile.role}
                </h3>

              </div>

              <div>

                <p className="text-gray-500 text-sm">
                  Organization
                </p>

                <h3 className="font-bold">
                  {profile.school}
                </h3>

              </div>

            </div>

          </motion.div>

        </div>
                {/* Footer */}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white"
        >
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">

            <div>

              <h2 className="text-2xl font-bold">
                Welcome, {profile.name || "Faculty Member"} 👋
              </h2>

              <p className="mt-2 text-blue-100">
                Continue creating smart lectures, managing schedules,
                and collaborating with your academic community through
                EduNexus.
              </p>

            </div>

            <div className="flex gap-4">

              <button
                className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:scale-105 transition duration-300 shadow-md"
                onClick={() =>
                  alert("Feature coming soon!")
                }
              >
                View Dashboard
              </button>

              <button
                className="bg-blue-800 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition duration-300 shadow-md"
                onClick={() =>
                  alert("Profile synced successfully!")
                }
              >
                Sync Profile
              </button>

            </div>

          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}