


// Feed.jsx
import { useEffect, useState } from "react";
import API from "../api";
import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";

const Feed = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    API.get("/posts/getPosts")
      .then((res) => {
        setPosts(res.data.posts || []);
      })
      .catch((err) =>
        alert(err.response?.data?.message || "Error fetching posts")
      );
  }, []);

  // ✅ Handle like/unlike
  const handleLike = async (postId, liked) => {
    try {
      await API.post(`/posts/${postId}/like`);
      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId
            ? {
                ...post,
                likes: liked ? post.likes + 1 : post.likes - 1,
              }
            : post
        )
      );
    } catch (err) {
      console.error("Like error:", err);
      alert("Failed to like post");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Navbar />
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} onLike={handleLike} />
        ))}
      </div>
    </div>
  );
};

export default Feed;

