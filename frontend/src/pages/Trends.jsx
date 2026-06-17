import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaGlobe,
  FaSearch,
  FaSyncAlt,
  FaRobot,
  FaGraduationCap,
  FaBookOpen,
  FaExternalLinkAlt,
  FaNewspaper,
  FaFire,
  FaLightbulb,
} from "react-icons/fa";

export default function Trends() {
  const [indiaNews, setIndiaNews] = useState([]);
  const [worldNews, setWorldNews] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");

  useEffect(() => {
    fetchNews();
  }, []);

  // ---------------- RSS PARSER ----------------

  const parseRSS = async (url) => {
    const proxy =
      "https://api.allorigins.win/raw?url=" +
      encodeURIComponent(url);

    const res = await fetch(proxy);

    const text = await res.text();

    const parser = new DOMParser();

    const xml = parser.parseFromString(
      text,
      "text/xml"
    );

    const items = xml.querySelectorAll("item");

    return Array.from(items).map((item) => ({
      title:
        item.querySelector("title")?.textContent ||
        "Untitled",

      link:
        item.querySelector("link")?.textContent ||
        "#",

      description:
        item.querySelector("description")
          ?.textContent ||
        "No description available.",

      source: "Google News",
    }));
  };

  const fetchNews = async () => {
    try {
      setLoading(true);

      const indiaRSS =
        "https://news.google.com/rss/search?q=education+india&hl=en-IN&gl=IN&ceid=IN:en";

      const worldRSS =
        "https://news.google.com/rss/search?q=education&hl=en-US&gl=US&ceid=US:en";

      const [india, world] = await Promise.all([
        parseRSS(indiaRSS),
        parseRSS(worldRSS),
      ]);

      setIndiaNews(india.slice(0, 12));
      setWorldNews(world.slice(0, 12));
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const resources = [
    {
      name: "NotebookLM",
      url: "https://notebooklm.google.com",
      icon: <FaRobot />,
      color: "bg-blue-500",
    },
    {
      name: "Google Scholar",
      url: "https://scholar.google.com",
      icon: <FaGraduationCap />,
      color: "bg-green-500",
    },
    {
      name: "Semantic Scholar",
      url: "https://www.semanticscholar.org",
      icon: <FaBookOpen />,
      color: "bg-purple-500",
    },
    {
      name: "Perplexity AI",
      url: "https://www.perplexity.ai",
      icon: <FaLightbulb />,
      color: "bg-pink-500",
    },
    {
      name: "arXiv",
      url: "https://arxiv.org",
      icon: <FaBookOpen />,
      color: "bg-orange-500",
    },
    {
      name: "Coursera",
      url: "https://www.coursera.org",
      icon: <FaGraduationCap />,
      color: "bg-indigo-500",
    },
  ];

  const allNews = [...indiaNews, ...worldNews].filter(
    (item) =>
      item.title
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  const featured =
    allNews.length > 0 ? allNews[0] : null;

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">

        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          }}
          className="text-6xl text-blue-600"
        >
          <FaSyncAlt />
        </motion.div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-7xl mx-auto">

        {/* HERO */}

        <motion.div
          initial={{
            opacity: 0,
            y: -20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700 text-white p-8 shadow-xl"
        >

          <div className="flex flex-col lg:flex-row justify-between items-center">

            <div>

              <h1 className="text-5xl font-bold">

                Education Intelligence Hub

              </h1>

              <p className="mt-3 text-blue-100 text-lg">

                Stay updated with the latest education,
                AI, research and EdTech developments.

              </p>

            </div>

            <div className="mt-6 lg:mt-0">

              <FaGlobe className="text-8xl opacity-30" />

            </div>

          </div>

        </motion.div>

        {/* Statistics */}

        <div className="grid md:grid-cols-4 gap-5 mt-8">

          <div className="bg-white rounded-2xl shadow-lg p-5">

            <FaNewspaper className="text-3xl text-blue-600 mb-3"/>

            <h2 className="text-3xl font-bold">

              {allNews.length}

            </h2>

            <p className="text-gray-500">

              Articles

            </p>

          </div>

          <div className="bg-white rounded-2xl shadow-lg p-5">

            <FaFire className="text-3xl text-red-500 mb-3"/>

            <h2 className="text-3xl font-bold">

              Trending

            </h2>

            <p className="text-gray-500">

              Live Updates

            </p>

          </div>

          <div className="bg-white rounded-2xl shadow-lg p-5">

            <FaRobot className="text-3xl text-purple-600 mb-3"/>

            <h2 className="text-3xl font-bold">

              AI

            </h2>

            <p className="text-gray-500">

              Education Tools

            </p>

          </div>

          <div className="bg-white rounded-2xl shadow-lg p-5">

            <FaGraduationCap className="text-3xl text-green-600 mb-3"/>

            <h2 className="text-3xl font-bold">

              Global

            </h2>

            <p className="text-gray-500">

              Research

            </p>

          </div>

        </div>
                {/* SEARCH & CONTROLS */}

        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">

          <div className="flex flex-col lg:flex-row gap-4">

            <div className="flex-1 relative">

              <FaSearch className="absolute left-4 top-4 text-gray-400" />

              <input
                type="text"
                placeholder="Search education news..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />

            </div>

            <button
              onClick={fetchNews}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition"
            >
              <FaSyncAlt />
              Refresh
            </button>

          </div>

          {/* CATEGORY FILTERS */}

          <div className="flex flex-wrap gap-3 mt-5">

            {[
              "All",
              "India",
              "Global",
              "AI",
              "EdTech",
              "Research",
            ].map((item) => (

              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`px-5 py-2 rounded-full transition font-medium ${
                  category === item
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 hover:bg-blue-100"
                }`}
              >
                {item}
              </button>

            ))}

          </div>

        </div>

        {/* AI RESOURCES */}

        <div className="mt-10">

          <div className="flex justify-between items-center mb-5">

            <h2 className="text-3xl font-bold">

              🚀 Faculty AI Toolkit

            </h2>

            <span className="text-gray-500">

              One-click productivity tools

            </span>

          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {resources.map((tool, index) => (

              <motion.div
                whileHover={{
                  scale: 1.03,
                }}
                key={index}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >

                <div
                  className={`${tool.color} h-2`}
                ></div>

                <div className="p-6">

                  <div className="text-4xl mb-4">

                    {tool.icon}

                  </div>

                  <h3 className="text-xl font-bold">

                    {tool.name}

                  </h3>

                  <p className="text-gray-500 mt-2">

                    Open this tool to assist with
                    teaching, research, note generation,
                    lesson planning and academic work.

                  </p>

                  <button
                    onClick={() =>
                      window.open(
                        tool.url,
                        "_blank"
                      )
                    }
                    className="mt-5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                  >
                    Open Tool

                    <FaExternalLinkAlt size={12} />

                  </button>

                </div>

              </motion.div>

            ))}

          </div>

        </div>

        {/* QUICK ACCESS */}

        <div className="mt-10 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-8 text-white shadow-xl">

          <div className="flex flex-col lg:flex-row justify-between items-center">

            <div>

              <h2 className="text-3xl font-bold">

                Faculty Productivity Center

              </h2>

              <p className="mt-3 text-indigo-100">

                Instantly access the world's best AI
                assistants and academic resources.

              </p>

            </div>

            <div className="grid grid-cols-2 gap-3 mt-6 lg:mt-0">

              <button
                onClick={() =>
                  window.open(
                    "https://notebooklm.google.com",
                    "_blank"
                  )
                }
                className="bg-white text-indigo-700 font-semibold px-4 py-3 rounded-xl hover:scale-105 transition"
              >
                NotebookLM
              </button>

              <button
                onClick={() =>
                  window.open(
                    "https://scholar.google.com",
                    "_blank"
                  )
                }
                className="bg-white text-indigo-700 font-semibold px-4 py-3 rounded-xl hover:scale-105 transition"
              >
                Scholar
              </button>

              <button
                onClick={() =>
                  window.open(
                    "https://www.perplexity.ai",
                    "_blank"
                  )
                }
                className="bg-white text-indigo-700 font-semibold px-4 py-3 rounded-xl hover:scale-105 transition"
              >
                Perplexity
              </button>

              <button
                onClick={() =>
                  window.open(
                    "https://arxiv.org",
                    "_blank"
                  )
                }
                className="bg-white text-indigo-700 font-semibold px-4 py-3 rounded-xl hover:scale-105 transition"
              >
                arXiv
              </button>

            </div>

          </div>

        </div>
                {/* FEATURED ARTICLE */}

        {featured && (

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mt-10 rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white"
          >

            <div className="p-8">

              <div className="flex items-center gap-3 mb-4">

                <span className="bg-red-500 px-3 py-1 rounded-full text-sm font-bold">

                  🔥 TRENDING

                </span>

                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">

                  Featured Story

                </span>

              </div>

              <h2 className="text-4xl font-bold leading-tight">

                {featured.title}

              </h2>

              <p className="mt-5 text-blue-100 text-lg line-clamp-4">

                {featured.description.replace(/<[^>]*>/g, "")}

              </p>

              <button
                onClick={() =>
                  window.open(
                    featured.link,
                    "_blank"
                  )
                }
                className="mt-6 bg-white text-indigo-700 px-6 py-3 rounded-xl font-semibold hover:scale-105 transition flex items-center gap-2"
              >
                Read Full Story

                <FaExternalLinkAlt />

              </button>

            </div>

          </motion.div>

        )}

        {/* NEWS SECTION */}

        <div className="mt-12">

          <div className="flex justify-between items-center mb-6">

            <h2 className="text-3xl font-bold">

              Latest Headlines

            </h2>

            <div className="text-gray-500">

              {allNews.length} Articles Found

            </div>

          </div>

          {/* CARD COMPONENT */}

          {(() => {

            const NewsCard = ({ article, index }) => (

              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: index * 0.05,
                }}
                whileHover={{
                  y: -6,
                  scale: 1.02,
                }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition overflow-hidden flex flex-col"
              >

                <div className="h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

                <div className="p-6 flex flex-col flex-1">

                  <div className="flex justify-between items-center">

                    <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">

                      {article.source}

                    </span>

                    <span className="text-xs text-red-500 font-bold">

                      Trending

                    </span>

                  </div>

                  <h3 className="text-xl font-bold mt-4 line-clamp-2">

                    {article.title}

                  </h3>

                  <p className="text-gray-600 mt-4 line-clamp-4 flex-1">

                    {article.description.replace(
                      /<[^>]*>/g,
                      ""
                    )}

                  </p>

                  <div className="mt-6 flex justify-between items-center">

                    <span className="text-sm text-gray-400">

                      Education News

                    </span>

                    <button
                      onClick={() =>
                        window.open(
                          article.link,
                          "_blank"
                        )
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                    >
                      Read

                      <FaExternalLinkAlt
                        size={12}
                      />

                    </button>

                  </div>

                </div>

              </motion.div>

            );
                        const filteredIndia = indiaNews.filter((article) => {
              const text =
                (
                  article.title +
                  " " +
                  article.description
                ).toLowerCase();

              if (
                !text.includes(search.toLowerCase())
              )
                return false;

              if (
                category === "All" ||
                category === "India"
              )
                return true;

              return text.includes(
                category.toLowerCase()
              );
            });

            const filteredWorld = worldNews.filter(
              (article) => {
                const text =
                  (
                    article.title +
                    " " +
                    article.description
                  ).toLowerCase();

                if (
                  !text.includes(
                    search.toLowerCase()
                  )
                )
                  return false;

                if (
                  category === "All" ||
                  category === "Global"
                )
                  return true;

                return text.includes(
                  category.toLowerCase()
                );
              }
            );

            return (
              <>

                {/* INDIA NEWS */}

                <div className="mb-12">

                  <h2 className="text-2xl font-bold text-blue-700 mb-6 flex items-center gap-2">

                    🇮🇳 India Education News

                  </h2>

                  {filteredIndia.length === 0 ? (

                    <div className="bg-white rounded-2xl shadow-lg p-10 text-center text-gray-500">

                      No matching India news found.

                    </div>

                  ) : (

                    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

                      {filteredIndia.map(
                        (article, index) => (
                          <NewsCard
                            key={`india-${index}`}
                            article={article}
                            index={index}
                          />
                        )
                      )}

                    </div>

                  )}

                </div>

                {/* GLOBAL NEWS */}

                <div>

                  <h2 className="text-2xl font-bold text-green-700 mb-6 flex items-center gap-2">

                    🌍 Global Education News

                  </h2>

                  {filteredWorld.length === 0 ? (

                    <div className="bg-white rounded-2xl shadow-lg p-10 text-center text-gray-500">

                      No matching Global news found.

                    </div>

                  ) : (

                    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

                      {filteredWorld.map(
                        (article, index) => (
                          <NewsCard
                            key={`world-${index}`}
                            article={article}
                            index={index}
                          />
                        )
                      )}

                    </div>

                  )}

                </div>

              </>
            );

          })()}

        </div>

        {/* FOOTER */}

        <div className="mt-16 rounded-3xl bg-gradient-to-r from-gray-900 to-gray-800 text-white p-8 shadow-xl">

          <div className="flex flex-col lg:flex-row justify-between items-center">

            <div>

              <h2 className="text-3xl font-bold">

                EduNexus Faculty Innovation Hub

              </h2>

              <p className="text-gray-300 mt-3 max-w-2xl">

                Stay connected with the latest trends in
                Education, Artificial Intelligence,
                Research, EdTech and Academic Innovation.
                Use the integrated AI tools to improve
                teaching, lesson planning, research and
                student engagement.

              </p>

            </div>

            <div className="mt-6 lg:mt-0 text-center">

              <div className="text-6xl">

                🎓

              </div>

              <p className="text-gray-400 mt-2">

                Smart Faculty • Smart Education

              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}