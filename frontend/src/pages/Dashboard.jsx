import { useState } from "react";
import { motion } from "framer-motion";

import Scheduler from "./Scheduler";
import ContentStudio from "./ContentStudio";
import InnovationHub from "./InnovationHub";
import Trends from "./Trends";
import Profile from "./Profile";
import Analytics from "./Analytics";

export default function Dashboard() {
  const [active, setActive] = useState("analytics");

  const menuItemClass = (key) =>
    `p-3 rounded-lg cursor-pointer transition-all ${
      active === key
        ? "bg-blue-600 text-white"
        : "hover:bg-slate-800"
    }`;

  const renderSection = () => {
    switch (active) {
      case "analytics":
        return <Analytics />;

      case "scheduler":
        return <Scheduler />;

      case "content":
        return <ContentStudio />;

      case "innovation":
        return <InnovationHub />;

      case "trends":
        return <Trends />;

      case "profile":
        return <Profile />;

      default:
        return <Analytics />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="h-screen"
    >
      <div className="flex h-full bg-gray-100">
        {/* SIDEBAR */}
        <div className="w-64 bg-slate-900 text-white shadow-xl flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-slate-700">
            <h1 className="text-3xl font-bold text-blue-400">
              EduNexus
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Academic Intelligence Platform
            </p>
          </div>

          {/* Menu */}
          <ul className="p-4 space-y-2">
            <li
              onClick={() => setActive("analytics")}
              className={menuItemClass("analytics")}
            >
              Analytics
            </li>

            <li
              onClick={() => setActive("scheduler")}
              className={menuItemClass("scheduler")}
            >
              Smart Scheduler
            </li>

            <li
              onClick={() => setActive("content")}
              className={menuItemClass("content")}
            >
              Content Studio
            </li>

            <li
              onClick={() => setActive("innovation")}
              className={menuItemClass("innovation")}
            >
              Innovation Hub
            </li>

            <li
              onClick={() => setActive("trends")}
              className={menuItemClass("trends")}
            >
              Trends
            </li>

            <li
              onClick={() => setActive("profile")}
              className={menuItemClass("profile")}
            >
              Profile
            </li>
          </ul>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">{renderSection()}</div>
        </div>
      </div>
    </motion.div>
  );
}