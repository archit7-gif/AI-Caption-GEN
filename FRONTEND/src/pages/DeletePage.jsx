
import { useEffect, useState } from "react";
import API from "../api";
import Navbar from "../components/Navbar";

const DeletePage = ({ embedded = false }) => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [profileDeleting, setProfileDeleting] = useState(false);
  const [postsDeleting, setPostsDeleting] = useState({}); // { postId: true/false }

  useEffect(() => {
    API.get("/users/me").then((res) => setUser(res.data.user));
    API.get("/posts/getPosts").then((res) => setPosts(res.data.posts || []));
  }, []);

  const deleteProfile = async () => {
    if (!window.confirm("Delete your profile picture?")) return;
    setProfileDeleting(true);
    try {
      await API.delete("/users/profile-image");
      setUser((prev) => ({ ...prev, profileImage: "" }));
      alert("Profile picture deleted!");
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    } finally {
      setProfileDeleting(false);
    }
  };

  const deletePost = async (postId) => {
    if (!window.confirm("Delete this post?")) return;
    setPostsDeleting((prev) => ({ ...prev, [postId]: true }));
    try {
      await API.delete(`/posts/${postId}`);
      setPosts(posts.filter((p) => p._id !== postId));
      alert("Post deleted!");
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    } finally {
      setPostsDeleting((prev) => ({ ...prev, [postId]: false }));
    }
  };

  return (
    <div className="flex flex-col gap-10 max-w-6xl mx-auto">
      {!embedded && <Navbar />}

      {/* Delete Profile */}
      <div className="bg-white/40 backdrop-blur-md rounded-xl shadow-lg p-6 transform transition duration-300 hover:scale-100 hover:shadow-2xl border border-white/30">
        <h3 className="text-xl font-semibold text-red-600">Profile Picture</h3>
        {user?.profileImage ? (
          <div className="flex items-center gap-6 mt-4">
            <img
              src={user.profileImage}
              alt="profile"
              className="w-20 h-20 rounded-full object-cover border-2 border-red-200 shadow-sm"
            />
            <button
              onClick={deleteProfile}
              disabled={profileDeleting}
              className={`text-white font-semibold px-5 py-2 rounded-lg transition duration-200
                ${profileDeleting ? "bg-red-300 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"}`}
            >
              {profileDeleting ? "Deleting..." : "Delete Picture"}
            </button>
          </div>
        ) : (
          <p className="mt-2 text-gray-500 text-sm">No profile picture uploaded.</p>
        )}
      </div>

      {/* Delete Posts */}
      <div className="bg-white/40 backdrop-blur-md rounded-xl shadow-lg p-6 transform transition duration-300 hover:scale-100 hover:shadow-2xl border border-white/30">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Your Posts</h3>
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div
                key={post._id}
                className="bg-white/30 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition duration-300 transform hover:-translate-y-1 border border-white/20"
              >
                <img src={post.image} alt="post" className="w-full h-40 object-cover" />
                <div className="p-4">
                  <p className="text-gray-700 text-sm line-clamp-2">{post.caption}</p>
                  <button
                    onClick={() => deletePost(post._id)}
                    disabled={postsDeleting[post._id]}
                    className={`w-full py-2 mt-3 rounded-lg font-semibold text-sm transition duration-200 text-white
                      ${postsDeleting[post._id] ? "bg-red-300 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"}`}
                  >
                    {postsDeleting[post._id] ? "Deleting..." : "Delete Post"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No posts yet.</p>
        )}
      </div>
    </div>
  );
};

export default DeletePage;


