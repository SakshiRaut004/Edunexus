import { useState } from "react";
import API from "../services/api";
import jsPDF from "jspdf";

export default function ContentStudio() {

  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState("Beginner");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

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
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setContent(res.data.content);

    } catch (err) {

      console.log(err);

      alert(
        err.response?.data?.error ||
          "Error generating content"
      );

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
            Authorization: `Bearer ${token}`,
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

    const lines = doc.splitTextToSize(
      content,
      180
    );

    doc.text(lines, 10, 30);

    doc.save(`${topic}.pdf`);
  };

  return (

<div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-100 p-8">

<div className="max-w-7xl mx-auto">

{/* Header */}

<div className="bg-gradient-to-r from-purple-700 to-blue-600 rounded-2xl shadow-xl p-8 text-white">

<h1 className="text-5xl font-bold">

🚀 AI Faculty Assistant

</h1>

<p className="mt-4 text-lg">

Create Notes, Lesson Plans, PPT Content, Assignments,
Reference Material and access the best AI tools for teaching.

</p>

</div>


{/* AI TOOLS */}

<div className="mt-8">

<h2 className="text-3xl font-bold text-gray-800 mb-5">

AI Productivity Tools

</h2>

<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">

<button

className="bg-blue-600 hover:scale-105 transition text-white rounded-xl p-5 shadow-lg"

onClick={() =>
window.open(
"https://notebooklm.google.com",
"_blank"
)
}

>

📚

<div className="font-bold mt-2">

NotebookLM

</div>

</button>

<button

className="bg-green-600 hover:scale-105 transition text-white rounded-xl p-5 shadow-lg"

onClick={() =>
window.open(
"https://chatgpt.com",
"_blank"
)
}

>

🤖

<div className="font-bold mt-2">

ChatGPT

</div>

</button>

<button

className="bg-purple-600 hover:scale-105 transition text-white rounded-xl p-5 shadow-lg"

onClick={() =>
window.open(
"https://gemini.google.com",
"_blank"
)
}

>

✨

<div className="font-bold mt-2">

Gemini

</div>

</button>

<button

className="bg-indigo-600 hover:scale-105 transition text-white rounded-xl p-5 shadow-lg"

onClick={() =>
window.open(
"https://www.perplexity.ai",
"_blank"
)
}

>

🔍

<div className="font-bold mt-2">

Perplexity

</div>

</button>

<button

className="bg-pink-600 hover:scale-105 transition text-white rounded-xl p-5 shadow-lg"

onClick={() =>
window.open(
"https://gamma.app",
"_blank"
)
}

>

📊

<div className="font-bold mt-2">

Gamma PPT

</div>

</button>

<button

className="bg-cyan-600 hover:scale-105 transition text-white rounded-xl p-5 shadow-lg"

onClick={() =>
window.open(
"https://www.canva.com",
"_blank"
)
}

>

🎨

<div className="font-bold mt-2">

Canva

</div>

</button>

<button

className="bg-orange-600 hover:scale-105 transition text-white rounded-xl p-5 shadow-lg"

onClick={() =>
window.open(
"https://consensus.app",
"_blank"
)
}

>

📖

<div className="font-bold mt-2">

Consensus

</div>

</button>

<button

className="bg-red-600 hover:scale-105 transition text-white rounded-xl p-5 shadow-lg"

onClick={() =>
window.open(
"https://typeset.io",
"_blank"
)
}

>

📝

<div className="font-bold mt-2">

SciSpace

</div>

</button>
<button
className="bg-gray-800 hover:scale-105 transition text-white rounded-xl p-5 shadow-lg"
onClick={() =>
window.open(
"https://scholar.google.com",
"_blank"
)
}
>
🎓
<div className="font-bold mt-2">
Google Scholar
</div>
</button>

<button
className="bg-emerald-600 hover:scale-105 transition text-white rounded-xl p-5 shadow-lg"
onClick={() =>
window.open(
"https://nptel.ac.in",
"_blank"
)
}
>
🎥
<div className="font-bold mt-2">
NPTEL
</div>
</button>

<button
className="bg-yellow-500 hover:scale-105 transition text-white rounded-xl p-5 shadow-lg"
onClick={() =>
window.open(
"https://swayam.gov.in",
"_blank"
)
}
>
🏫
<div className="font-bold mt-2">
SWAYAM
</div>
</button>

<button
className="bg-violet-700 hover:scale-105 transition text-white rounded-xl p-5 shadow-lg"
onClick={() =>
window.open(
"https://www.youtube.com/results?search_query=education",
"_blank"
)
}
>
📺
<div className="font-bold mt-2">
Educational Videos
</div>
</button>

</div>

</div>

{/* CONTENT GENERATOR */}

<div className="mt-10 bg-white rounded-2xl shadow-xl p-8">

<h2 className="text-3xl font-bold text-gray-800">

AI Content Generator

</h2>

<p className="text-gray-500 mt-2">

Generate lecture notes, assignments, lesson plans and study material.

</p>

<div className="grid md:grid-cols-3 gap-5 mt-6">

<input
type="text"
placeholder="Enter Topic"
value={topic}
onChange={(e)=>setTopic(e.target.value)}
className="border-2 border-gray-300 rounded-xl p-4 focus:outline-none focus:border-purple-600"
/>

<select
value={level}
onChange={(e)=>setLevel(e.target.value)}
className="border-2 border-gray-300 rounded-xl p-4"
>

<option>Beginner</option>

<option>Intermediate</option>

<option>Advanced</option>

</select>

<button

onClick={generateContent}

disabled={loading}

className={`rounded-xl text-white font-bold transition ${
loading
?
"bg-gray-400"
:
"bg-purple-700 hover:bg-purple-800"
}`}

>

{

loading

?

"Generating..."

:

"🚀 Generate"

}

</button>

</div>

<div className="flex flex-wrap gap-4 mt-8">

<button

onClick={saveContent}

disabled={!content}

className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl"

>

💾 Save

</button>

<button

onClick={copyContent}

disabled={!content}

className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-xl"

>

📋 Copy

</button>

<button

onClick={downloadPDF}

disabled={!content}

className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"

>

📄 Download PDF

</button>

</div>
      {/* GENERATED CONTENT */}

      <div className="mt-10">

        <h2 className="text-3xl font-bold text-gray-800 mb-4">

          📄 Generated Content

        </h2>

        <div className="bg-gray-50 border rounded-2xl shadow-lg p-6 min-h-[400px]">

          {loading ? (

            <div className="flex flex-col items-center justify-center h-72">

              <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-purple-700"></div>

              <p className="mt-6 text-xl text-purple-700 font-semibold">

                AI is generating your content...

              </p>

            </div>

          ) : (

            <div>

              {content ? (

                <pre className="whitespace-pre-wrap text-gray-700 leading-8 text-[16px]">

                  {content}

                </pre>

              ) : (

                <div className="flex flex-col items-center justify-center h-72">

                  <div className="text-7xl">

                    🤖

                  </div>

                  <h3 className="text-2xl font-bold mt-5 text-gray-700">

                    AI Faculty Assistant Ready

                  </h3>

                  <p className="text-gray-500 mt-3 text-center max-w-xl">

                    Enter a topic above and click

                    <span className="font-bold text-purple-700">

                      {" "}Generate{" "}

                    </span>

                    to create lecture notes, assignments,

                    lesson plans, reference material,

                    quizzes, and study content.

                  </p>

                </div>

              )}

            </div>

          )}

        </div>

      </div>



      {/* QUICK FEATURES */}

      <div className="mt-10 grid md:grid-cols-4 gap-5">

        <div className="bg-white rounded-xl shadow-lg p-5 hover:scale-105 transition">

          <div className="text-5xl">

            📚

          </div>

          <h3 className="font-bold text-xl mt-3">

            Lecture Notes

          </h3>

          <p className="text-gray-500 mt-2">

            Generate detailed classroom notes instantly.

          </p>

        </div>

        <div className="bg-white rounded-xl shadow-lg p-5 hover:scale-105 transition">

          <div className="text-5xl">

            📝

          </div>

          <h3 className="font-bold text-xl mt-3">

            Assignments

          </h3>

          <p className="text-gray-500 mt-2">

            Create assignments and practice questions.

          </p>

        </div>

        <div className="bg-white rounded-xl shadow-lg p-5 hover:scale-105 transition">

          <div className="text-5xl">

            🎯

          </div>

          <h3 className="font-bold text-xl mt-3">

            Lesson Plans

          </h3>

          <p className="text-gray-500 mt-2">

            Build structured lesson plans for every class.

          </p>

        </div>

        <div className="bg-white rounded-xl shadow-lg p-5 hover:scale-105 transition">

          <div className="text-5xl">

            🎓

          </div>

          <h3 className="font-bold text-xl mt-3">

            Research Support

          </h3>

          <p className="text-gray-500 mt-2">

            Access AI tools and academic resources quickly.

          </p>

        </div>

      </div>

    </div>

  </div>
</div>

);

}