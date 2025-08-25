



import { useState } from "react";
import { FaHeart, FaRegHeart, FaRegComment, FaShare } from "react-icons/fa";
import { Link } from "react-router-dom";

const PostCard = ({ post, onLike }) => {
  const [liked, setLiked] = useState(post.isLiked || false);
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);

  const handleLike = () => {
    const newLiked = !liked;
    setLiked(newLiked);

    setLikeCount((prev) => {
      const newCount = newLiked ? prev + 1 : prev - 1;
      return newCount < 0 ? 0 : newCount;
    });

    if (typeof onLike === "function") {
      onLike(post._id, newLiked);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/comments/${post._id}`
    );
    alert("Post link copied to clipboard!");
  };

  const randomComment =
    post.comments && post.comments.length > 0
      ? post.comments[Math.floor(Math.random() * post.comments.length)]
      : null;

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* User Info */}
      <div className="flex items-center px-4 py-3">
        <img
          src={post.user?.profileImage || "https://i.pravatar.cc/40"}
          alt="profile"
          className="w-10 h-10 rounded-full object-cover"
        />
        <p className="ml-3 font-semibold text-gray-800">
          {post.user?.username}
        </p>
      </div>

      {/* Post Image */}
      <img
        src={post.image}
        alt="post"
        className="w-full h-[260px] object-cover"
      />

      {/* Caption */}
      <div className="px-4 py-3">
        <p className="text-gray-700 mb-2">{post.caption}</p>

        {/* Actions */}
        <div className="flex items-center space-x-6 mb-2">
          <button onClick={handleLike}>
            {liked ? (
              <FaHeart className="text-red-500 text-xl transition-transform transform scale-110" />
            ) : (
              <FaRegHeart className="text-xl text-gray-700 hover:text-red-500 transition" />
            )}
          </button>

          <Link to={`/comments/${post._id}`}>
            <FaRegComment className="text-xl text-gray-700 hover:text-purple-600 transition" />
          </Link>

          <button onClick={handleShare}>
            <FaShare className="text-xl text-gray-700 hover:text-indigo-600 transition" />
          </button>
        </div>

        {/* Likes count */}
        <p className="text-sm text-gray-600">{likeCount} likes</p>

        {/* Random comment preview */}
        {randomComment && (
          <Link
            to={`/comments/${post._id}`}
            className="text-sm text-gray-700 block mt-2 italic hover:text-purple-600 transition"
          >
            {randomComment.text.length > 50
              ? randomComment.text.slice(0, 50) + "..."
              : randomComment.text}
          </Link>
        )}
      </div>
    </div>
  );
};

export default PostCard;

