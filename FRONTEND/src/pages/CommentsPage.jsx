
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import API from "../api";

const CommentsPage = () => {
  const { postId } = useParams();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Fetch comments
  useEffect(() => {
    API.get(`/posts/${postId}/comments`)
      .then((res) => {
        setComments(res.data || []);
      })
      .catch((err) => console.error("Error fetching comments:", err));
  }, [postId]);

  // ✅ Add Comment
  const handlePostComment = async () => {
    if (!newComment.trim()) return;
    setLoading(true);
    try {
      const res = await API.post(`/posts/${postId}/comments`, { text: newComment });
      const newC = res.data;
      if (newC?._id) {
        setComments((prev) => [...prev, newC]);
      }
      setNewComment("");
    } catch (err) {
      console.error("Error posting comment:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete Comment
  const handleDeleteComment = async (commentId) => {
    try {
      await API.delete(`/posts/${postId}/comments/${commentId}`);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error("Error deleting comment:", err);
      alert("Failed to delete comment");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/60 backdrop-blur-md border-b border-white/30 shadow-md">
        <div className="w-full px-6 py-3 flex items-center justify-between">
          {/* Left */}
          <h1 className="font-bold text-xl text-purple-700 tracking-wide">
            Mini Insta
          </h1>

          {/* Right */}
          <Link
            to="/feed"
            className="text-gray-700 font-medium hover:text-purple-600 transition"
          >
            Home
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Comments
        </h2>

        {/* Comment List */}
        <div className="space-y-4 mb-6">
          {comments.length > 0 ? (
            comments.map((c) => (
              <div
                key={c._id}
                className="flex justify-between items-center bg-white/80 backdrop-blur-sm rounded-xl shadow-sm px-4 py-3 hover:shadow-lg transition-all border border-gray-100"
              >
                <p className="text-gray-800">{c.text}</p>
                <button
                  onClick={() => handleDeleteComment(c._id)}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  <FaTrash />
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">No comments yet. Be the first!</p>
          )}
        </div>

        {/* Comment Input */}
        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-2 shadow-sm">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            maxLength={100}
            placeholder="Write a comment..."
            className="flex-1 border-none bg-transparent rounded-lg px-3 py-2 focus:outline-none focus:ring-0 text-gray-700"
            disabled={loading}
          />
          <button
            onClick={handlePostComment}
            disabled={loading}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 py-2 rounded-lg font-medium shadow hover:from-purple-700 hover:to-indigo-700 transition-transform transform hover:scale-105 disabled:opacity-60"
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentsPage;


