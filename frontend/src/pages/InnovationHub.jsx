import { useState, useEffect } from "react";
import API from "../services/api";

export default function InnovationHub() {
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await API.get("/posts", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPosts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePost = async () => {
    if (!content.trim()) {
      alert("Write something!");
      return;
    }

    try {
      setLoading(true);

      await API.post(
        "/posts",
        { content },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setContent("");
      fetchPosts();
    } catch (err) {
      alert("Error posting content");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      await API.put(
        `/posts/${postId}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleComment = async (postId, text, resetInput) => {
    if (!text.trim()) return;

    try {
      await API.post(
        `/posts/${postId}/comment`,
        { text },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      resetInput();
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Innovation Hub
        </h1>
        <p className="text-gray-500">
          Share ideas, teaching methods, and innovations
        </p>
      </div>

      {/* CREATE POST CARD */}
      <div className="bg-white rounded-xl shadow-md p-5 space-y-3">
        <textarea
          placeholder="Share your ideas or teaching techniques..."
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="flex justify-end">
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
      <div className="space-y-4">
        {posts.length === 0 && (
          <div className="text-center text-gray-500">
            No posts yet. Be the first to share an idea!
          </div>
        )}

        {posts.map((post) => (
          <div
            key={post._id}
            className="bg-white rounded-xl shadow-md p-5 space-y-3"
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