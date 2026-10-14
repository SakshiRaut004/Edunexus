import { useState, useEffect } from "react";
import API from "../services/api";

const loadPosts = () => API.get("/posts");

export default function InnovationHub({ searchQuery = "" }) {
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    let active = true;
    loadPosts()
      .then((res) => {
        if (active) setPosts(res.data);
      })
      .catch((err) => {
        if (active) setError(err.response?.data?.message || "The faculty network could not be loaded. Please try again.");
      })
      .finally(() => {
        if (active) setLoadingPosts(false);
      });

    return () => {
      active = false;
    };
  }, [token]);

  const fetchPosts = async () => {
    setLoadingPosts(true);
    try {
      const res = await loadPosts();
      setPosts(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "The faculty network could not be loaded. Please try again.");
    } finally {
      setLoadingPosts(false);
    }
  };

  const handlePost = async () => {
    if (!content.trim()) return;
    setError("");

    try {
      setLoading(true);

      await API.post(
        "/posts",
        { content: content.trim() }
      );

      setContent("");
      await fetchPosts();
    } catch (err) {
      setError(err.response?.data?.message || "Your post couldn't be shared. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      await API.put(
        `/posts/${postId}/like`,
        {}
      );

      await fetchPosts();
    } catch (err) {
      setError(err.response?.data?.message || "Like could not be saved. Please try again.");
    }
  };

  const handleComment = async (postId, text, resetInput) => {
    if (!text.trim()) return;

    try {
      await API.post(
        `/posts/${postId}/comment`,
        { text }
      );

      resetInput();
      await fetchPosts();
    } catch (err) {
      setError(err.response?.data?.message || "Comment could not be added. Please try again.");
    }
  };

  const visiblePosts = posts.filter((post) => {
    const query = searchQuery.trim().toLowerCase();
    return !query || `${post.content} ${post.facultyId?.name || ""}`.toLowerCase().includes(query);
  });

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Faculty exchange
        </h1>
        <p className="text-gray-500">
          Practical ideas and meaningful milestones from across the network.
        </p>
      </div>

      {/* CREATE POST CARD */}
      <div className="bg-white rounded-lg border border-gray-200 p-5 space-y-3">
        <textarea
          id="community-composer"
          aria-label="Share with the faculty network"
          maxLength={2000}
          placeholder="What are you working on? Share a teaching idea, project, or faculty milestone..."
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-gray-400">{content.length}/2000</span>
          <button
            onClick={handlePost}
            disabled={loading}
            className={`px-5 py-2 rounded-lg text-white transition ${
              loading
                ? "bg-gray-400"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      </div>

      {/* FEED */}
      {error && <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}

      <div className="space-y-4">
        {loadingPosts && <p className="py-8 text-center text-sm text-gray-500">Loading faculty posts...</p>}
        {!loadingPosts && visiblePosts.length === 0 && (
          <div className="rounded-lg border border-gray-200 bg-white px-5 py-8 text-center text-sm text-gray-500">
            {searchQuery ? "No posts match your search." : "No posts yet. Share the first idea with your colleagues."}
          </div>
        )}

        {visiblePosts.map((post) => (
          <div
            key={post._id}
            className="bg-white rounded-lg border border-gray-200 p-5 space-y-3"
          >
            {/* HEADER */}
            <div className="flex justify-between items-center">
              <p className="font-semibold text-gray-800">
                {post.facultyId?.name || "Unknown User"}
              </p>

              <p className="text-xs text-gray-400">
                {new Date(post.createdAt).toLocaleString()}
              </p>
            </div>

            {/* CONTENT */}
            <p className="text-gray-700">{post.content}</p>

            {/* ACTIONS */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleLike(post._id)}
                className="text-blue-600 hover:text-blue-800 transition"
              >
                ❤️ {post.likes?.length || 0}
              </button>
            </div>

            {/* COMMENT INPUT */}
            <CommentBox post={post} onComment={handleComment} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* COMMENT COMPONENT */
function CommentBox({ post, onComment }) {
  const [text, setText] = useState("");

  return (
    <div className="space-y-2">
      <input
        type="text"
        placeholder="Write a comment and press Enter..."
        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onComment(post._id, text, () => setText(""));
          }
        }}
      />

      {/* COMMENTS */}
      <div className="space-y-1">
        {post.comments?.map((c, i) => (
          <p key={i} className="text-sm text-gray-600">
            💬 {c.text}
          </p>
        ))}
      </div>
    </div>
  );
}