import { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const PASS_MARKS = 40;
const PIE_COLORS = ["#22c55e", "#ef4444"];

export default function Analytics() {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // ---------------- CSV PARSER ----------------
  const parseCSV = (text) => {
    const rows = text.trim().split(/\r?\n/);

    if (rows.length < 2) throw new Error("Invalid CSV");

    const headers = rows[0].split(",").map((h) => h.trim());

    const subjectColumns = headers.filter(
      (h) =>
        ![
          "StudentId",
          "Name",
          "Total",
          "Grade",
        ].includes(h)
    );

    const parsed = rows.slice(1).map((row, index) => {
      const values = row.split(",");

      const student = {
        _id: index + 1,
      };

      headers.forEach((h, i) => {
        student[h] = values[i]?.trim();
      });

      // calculate total from subjects
      let total = 0;
      subjectColumns.forEach((sub) => {
        total += Number(student[sub] || 0);
      });

      const percentage =
        subjectColumns.length > 0
          ? total / subjectColumns.length
          : 0;

      return {
        ...student,
        calculatedTotal: total,
        percentage,
      };
    });

    return { students: parsed, subjects: subjectColumns };
  };

  // ---------------- UPLOAD ----------------
  const uploadCSV = async () => {
    if (!file) return alert("Select CSV file");

    try {
      setLoading(true);

      const text = await file.text();
      const result = parseCSV(text);

      setStudents(result.students);
      setSubjects(result.subjects);
    } catch (err) {
      console.error(err);
      alert("Invalid CSV format");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- DERIVED DATA ----------------
  const ranked = [...students].sort(
    (a, b) => b.calculatedTotal - a.calculatedTotal
  );

  const rankedWithRank = ranked.map((s, i) => ({
    ...s,
    rank: i + 1,
  }));

  const passCount = students.filter(
    (s) => s.percentage >= PASS_MARKS
  ).length;

  const failCount = students.length - passCount;

  const passRate =
    students.length > 0
      ? ((passCount / students.length) * 100).toFixed(1)
      : 0;

  const avgMarks =
    students.length > 0
      ? (
          students.reduce(
            (a, b) => a + b.calculatedTotal,
            0
          ) / students.length
        ).toFixed(1)
      : 0;

  const sortedTotals = students
    .map((s) => s.calculatedTotal)
    .sort((a, b) => a - b);

  const median =
    sortedTotals.length % 2 === 0
      ? (
          sortedTotals[sortedTotals.length / 2 - 1] +
          sortedTotals[sortedTotals.length / 2]
        ) / 2
      : sortedTotals[Math.floor(sortedTotals.length / 2)];

  const topper = ranked[0];
  const lowest = ranked[ranked.length - 1];

  const excellent = students.filter((s) => s.percentage >= 90);
  const risk = students.filter((s) => s.percentage < 40);

  // ---------------- SUBJECT ANALYSIS ----------------
  const subjectAnalysis = subjects.map((sub) => {
    const marks = students.map((s) => Number(s[sub] || 0));

    const avg = marks.reduce((a, b) => a + b, 0) / marks.length;

    const topperStudent = students.reduce((best, cur) =>
      Number(cur[sub]) > Number(best[sub]) ? cur : best
    );

    return {
      subject: sub,
      average: Number(avg.toFixed(1)),
      highest: Math.max(...marks),
      lowest: Math.min(...marks),
      passPercent:
        ((marks.filter((m) => m >= PASS_MARKS).length /
          marks.length) *
          100).toFixed(1),
      topper: topperStudent?.Name,
    };
  });

  const bestSubject = [...subjectAnalysis].sort(
    (a, b) => b.average - a.average
  )[0];

  const hardSubject = [...subjectAnalysis].sort(
    (a, b) => a.average - b.average
  )[0];

  // ---------------- PERFORMANCE BANDS ----------------
  const bands = [
    { band: "90-100", count: students.filter((s) => s.percentage >= 90).length },
    {
      band: "75-89",
      count: students.filter((s) => s.percentage >= 75 && s.percentage < 90)
        .length,
    },
    {
      band: "60-74",
      count: students.filter((s) => s.percentage >= 60 && s.percentage < 75)
        .length,
    },
    {
      band: "40-59",
      count: students.filter((s) => s.percentage >= 40 && s.percentage < 60)
        .length,
    },
    { band: "<40", count: risk.length },
  ];

  // ---------------- UI ----------------
  if (!students.length) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>

        <div className="bg-white p-5 rounded-xl shadow">
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files[0])}
            className="border p-2 w-full"
          />

          <button
            onClick={uploadCSV}
            disabled={loading}
            className="mt-4 px-5 py-2 bg-blue-600 text-white rounded"
          >
            {loading ? "Processing..." : "Upload CSV"}
          </button>
        </div>
      </div>
    );
  }

  // ---------------- RENDER ----------------
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Analytics Dashboard</h1>

      {/* KPI */}
      <div className="grid md:grid-cols-4 gap-4">
        <KPI title="Students" value={students.length} />
        <KPI title="Pass %" value={`${passRate}%`} />
        <KPI title="Average" value={avgMarks} />
        <KPI title="Median" value={median} />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <KPI title="Topper" value={topper?.Name} color="text-green-600" />
        <KPI title="Lowest" value={lowest?.Name} color="text-red-600" />
        <KPI title="At Risk" value={risk.length} />
      </div>

      {/* INSIGHTS */}
      <div className="bg-blue-50 p-5 rounded-xl">
        <h2 className="font-semibold mb-2">Insights</h2>
        <ul className="space-y-1">
          <li>Best Subject: {bestSubject?.subject}</li>
          <li>Hardest Subject: {hardSubject?.subject}</li>
          <li>Excellent Students: {excellent.length}</li>
          <li>At Risk Students: {risk.length}</li>
        </ul>
      </div>

      {/* CHARTS */}
      <div className="grid md:grid-cols-2 gap-6">
        <Chart title="Student Scores" data={ranked} dataKey="calculatedTotal" />
        <PieChartComp pass={passCount} fail={failCount} />
      </div>

      <Chart title="Subject Average" data={subjectAnalysis} dataKey="average" />

      <Chart title="Performance Bands" data={bands} dataKey="count" />

      {/* SUBJECT TABLE */}
      <div className="bg-white p-5 rounded-xl shadow">
        <h2 className="font-semibold mb-3">Subject Analysis</h2>
        <table className="w-full">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Avg</th>
              <th>High</th>
              <th>Low</th>
              <th>Pass%</th>
              <th>Topper</th>
            </tr>
          </thead>
          <tbody>
            {subjectAnalysis.map((s) => (
              <tr key={s.subject}>
                <td>{s.subject}</td>
                <td>{s.average}</td>
                <td>{s.highest}</td>
                <td>{s.lowest}</td>
                <td>{s.passPercent}%</td>
                <td>{s.topper}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* TOP 5 */}
      <div className="bg-white p-5 rounded-xl shadow">
        <h2 className="font-semibold mb-3">Top 5 Students</h2>
        <table className="w-full">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Total</th>
              <th>%</th>
            </tr>
          </thead>
          <tbody>
            {rankedWithRank.slice(0, 5).map((s) => (
              <tr key={s._id}>
                <td>{s.rank}</td>
                <td>{s.Name}</td>
                <td>{s.calculatedTotal}</td>
                <td>{s.percentage.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function KPI({ title, value, color = "text-gray-900" }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <p className="text-gray-500 text-sm">{title}</p>
      <h3 className={`text-2xl font-bold ${color}`}>{value}</h3>
    </div>
  );
}

function Chart({ title, data, dataKey }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <h2 className="font-semibold mb-3">{title}</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey={data[0] ? Object.keys(data[0])[0] : "name"} />
          <YAxis />
          <Tooltip />
          <Bar dataKey={dataKey} fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function PieChartComp({ pass, fail }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <h2 className="font-semibold mb-3">Pass vs Fail</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={[
            { name: "Pass", value: pass },
            { name: "Fail", value: fail }
          ]} dataKey="value" outerRadius={100}>
            <Cell fill="#22c55e" />
            <Cell fill="#ef4444" />
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}