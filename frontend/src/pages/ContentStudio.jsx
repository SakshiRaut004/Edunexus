import { useEffect, useState } from "react";
import API from "../services/api";
import jsPDF from "jspdf";

export default function ContentStudio() {
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState("Beginner");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [savedContent, setSavedContent] = useState([]);
  const [saveMessage, setSaveMessage] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    let active = true;
    API.get("/content")
      .then((res) => {
        if (active) setSavedContent(res.data);
      })
      .catch(() => {
        if (active) setSaveMessage("Saved materials could not be loaded.");
      });

    return () => {
      active = false;
    };
  }, [token]);

  const generateContent = async () => {
    if (!topic) {
      alert("Please enter a topic");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post(
        "/content/generate",
        {
          topic,
          level,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      setContent(res.data.content);
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.error || "Error generating content");
    } finally {
      setLoading(false);
    }
  };

  const saveContent = async () => {
    if (!content) {
      alert("Generate content first");
      return;
    }

    try {
      await API.post(
        "/content/save",
        {
          topic,
          level,
          generatedContent: content,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      alert("Content Saved Successfully!");
    } catch {
      alert("Error Saving Content");
    }
  };

  const copyContent = () => {
    navigator.clipboard.writeText(content);
    alert("Copied Successfully!");
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(topic, 10, 15);
    doc.setFontSize(12);

    const lines = doc.splitTextToSize(content, 180);
    doc.text(lines, 10, 30);
    doc.save(`${topic}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-purple-700 to-blue-600 rounded-2xl shadow-xl p-8 text-white">
          <h1 className="text-5xl font-bold">🚀 AI Faculty Assistant</h1>
          <p className="mt-4 text-lg">
            Create Notes, Lesson Plans, PPT Content, Assignments,
            Reference Material and access the best AI tools for teaching.
          </p>
        </div>

        <div className="mt-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-5">AI Productivity Tools</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            <button className="bg-blue-600 hover:scale-105 transition text-white rounded-xl p-5 shadow-lg" onClick={() => window.open("https://notebooklm.google.com", "_blank")}>📚 <div className="font-bold mt-2">NotebookLM</div></button>
            <button className="bg-green-600 hover:scale-105 transition text-white rounded-xl p-5 shadow-lg" onClick={() => window.open("https://chatgpt.com", "_blank")}>🤖 <div className="font-bold mt-2">ChatGPT</div></button>
            <button className="bg-purple-600 hover:scale-105 transition text-white rounded-xl p-5 shadow-lg" onClick={() => window.open("https://gemini.google.com", "_blank")}>✨ <div className="font-bold mt-2">Gemini</div></button>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-2xl font-bold text-gray-800">Generate course content</h3>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Topic or concept"
              className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select value={level} onChange={(e) => setLevel(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>

          <div className="mt-5 flex gap-3">
            <button onClick={generateContent} disabled={loading} className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-60">
              {loading ? "Generating..." : "Generate content"}
            </button>
            <button onClick={saveContent} className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700">Save</button>
            <button onClick={copyContent} className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700">Copy</button>
            <button onClick={downloadPDF} className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700">Download PDF</button>
          </div>

          {saveMessage && <p className="mt-4 text-sm text-gray-600">{saveMessage}</p>}

          {content && (
            <div className="mt-6 rounded-xl border border-gray-200 bg-slate-50 p-4">
              <h4 className="mb-3 text-lg font-semibold text-gray-800">Generated content</h4>
              <pre className="whitespace-pre-wrap text-sm leading-6 text-gray-700">{content}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
