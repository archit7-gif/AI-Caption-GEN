

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import Navbar from "../components/Navbar";

const Upload = ({ embedded = false }) => {
  const [postFile, setPostFile] = useState(null);
  const [profileFile, setProfileFile] = useState(null);
  const [postLoading, setPostLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const navigate = useNavigate();

  const handlePostUpload = async (e) => {
    e.preventDefault();
    if (!postFile) return alert("Select a post image");
    setPostLoading(true);
    const formData = new FormData();
    formData.append("image", postFile);

    try {
      await API.post("/posts", formData, { headers: { "Content-Type": "multipart/form-data" } });
      alert("Post uploaded!");
      setPostFile(null);
      navigate("/feed");
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    } finally {
      setPostLoading(false);
    }
  };

  const handleProfileUpload = async (e) => {
    e.preventDefault();
    if (!profileFile) return alert("Select a profile image");
    setProfileLoading(true);

    const formData = new FormData();
    formData.append("profileImage", profileFile);

    try {
      await API.post("/users/profile-image", formData, { headers: { "Content-Type": "multipart/form-data" } });
      alert("Profile picture updated!");
      setProfileFile(null);
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    } finally {
      setProfileLoading(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between mt-[100px] items-start gap-8 max-w-6xl mx-auto">
      {!embedded && <Navbar />}

      {/* Upload Post */}
      <form
        onSubmit={handlePostUpload}
        className="bg-white/40 backdrop-blur-md rounded-xl shadow-lg p-6 w-full max-w-sm transform transition duration-300 hover:scale-105 hover:shadow-2xl border border-white/30"
      >
        <h2 className="text-xl font-bold text-purple-600 mb-4 text-center">Upload Post</h2>
        <input
          type="file"
          onChange={(e) => setPostFile(e.target.files[0])}
          className="mb-4 w-full border border-white/50 p-2 rounded-lg text-sm bg-white/30 placeholder-gray-600 text-gray-800"
          disabled={postLoading}
        />
        <button
          type="submit"
          disabled={postLoading}
          className={`text-white font-semibold px-4 py-2 w-full rounded-lg transition duration-200
            ${postLoading ? "bg-purple-300 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"}`}
        >
          {postLoading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {/* Update Profile Pic */}
      <form
        onSubmit={handleProfileUpload}
        className="bg-white/40 backdrop-blur-md rounded-xl shadow-lg p-6 w-full max-w-sm transform transition duration-300 hover:scale-105 hover:shadow-2xl border border-white/30"
      >
        <h2 className="text-xl font-bold text-green-600 mb-4 text-center">Update Profile Picture</h2>
        <input
          type="file"
          onChange={(e) => setProfileFile(e.target.files[0])}
          className="mb-4 w-full border border-white/50 p-2 rounded-lg text-sm bg-white/30 placeholder-gray-600 text-gray-800"
          disabled={profileLoading}
        />
        <button
          type="submit"
          disabled={profileLoading}
          className={`text-white font-semibold px-4 py-2 w-full rounded-lg transition duration-200
            ${profileLoading ? "bg-green-300 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
        >
          {profileLoading ? "Updating..." : "Update"}
        </button>
      </form>
    </div>
  );
};

export default Upload;

