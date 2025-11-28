import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Camera, Mail, Calendar, Phone, User } from "lucide-react";
import PostCardCategory from "../CategoryPosts/PostCardCategory";

function Profile({ user, setUser }) {
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [viewPicture, setViewPicture] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const fileInputRef = useRef();


  function toProperCase(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

  // =================================
  // 🔄 Smooth User Refresh
  // =================================
  const refreshUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/profile/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser({
        ...res.data,
        profilePicture: res.data.profilePicture
          ? `${res.data.profilePicture}?t=${Date.now()}`
          : null,
      });
    } catch (err) {
      console.error("Error refreshing profile:", err);
    }
  };

  // =================================
  // 📝 Fetch User Posts
  // =================================
  useEffect(() => {
    if (!user || !user.id) return;

    const fetchUserPosts = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:5000/api/profile/myblogs",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUserPosts(res.data || []);
      } catch (err) {
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [user]);

  // =================================
  // 📸 Handle Upload
  // =================================
const handleFileChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setShowPopup(false);
  setImgLoaded(false);

  // 🟢 INSTANT UI PREVIEW — NO FLASHING OLD IMAGE
  const localPreview = URL.createObjectURL(file);
  setUser((prev) => ({
    ...prev,
    profilePicture: localPreview, // temporary preview
  }));

  try {
    const formData = new FormData();
    formData.append("profilePic", file);

    const token = localStorage.getItem("token");
    const res = await axios.put(
      `http://localhost:5000/api/profile/updateProfilePic/${user.id}`,
      formData,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // 🟢 Use server URL (with timestamp) after upload completes
    setUser((prev) => ({
      ...prev,
      profilePicture: `${res.data.imageUrl}?t=${Date.now()}`,
    }));

  } catch (err) {
    console.error("Upload failed", err);
  }

  // clear file input
  e.target.value = "";
};


  // =================================
  // ❌ Remove Picture
  // =================================
  const handleRemovePicture = async () => {
  if (!window.confirm("Remove your profile picture?")) return;

  setShowPopup(false);
  setImgLoaded(false);

  // 🟢 INSTANT UI UPDATE (no flashing old image)
  setUser((prev) => ({
    ...prev,
    profilePicture: null,
  }));

  try {
    const token = localStorage.getItem("token");
    await axios.delete(
      `http://localhost:5000/api/profile/removeProfilePic/${user.id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // 🟢 Refresh user from backend
    await refreshUser();

    // 🔄 Auto refresh (optional)
    setTimeout(() => window.location.reload(), 1000);
  } catch (err) {
    console.error("Remove failed:", err);
  }
};


  // =================================
  // 🔍 View Picture
  // =================================
  const handleViewPicture = () => {
    if (!user.profilePicture) return alert("No profile picture set.");
    setViewPicture(true);
    setShowPopup(false);
  };

  // If no user
  if (!user) {
    return (
      <div className="p-6 text-center text-gray-600">
        Please login to view your profile.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-5 py-8">

      {/* ================================================== */}
      {/* 🧑 Profile Header Card */}
      {/* ================================================== */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden mb-6">

        {/* Banner */}
        <div className="h-40 w-full bg-gradient-to-br from-slate-600 to-slate-800 relative">
          <div className="absolute left-1/2 bottom-[-55px] transform -translate-x-1/2">
            <div className="relative">
              {/* PROFILE IMAGE WITH FADE-IN FIX */}
              <img
                src={
                  user.profilePicture
                    ? `${user.profilePicture}?t=${Date.now()}`
                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user.name
                      )}&background=e5e7eb&color=4b5563&size=200`
                }
                onLoad={() => setImgLoaded(true)}
                style={{
                  opacity: imgLoaded ? 1 : 0,
                  transition: "opacity 0.4s ease",
                }}
                className="w-28 h-28 rounded-full border-4 border-white shadow-lg object-cover cursor-pointer hover:opacity-90"
                onClick={() => setShowPopup(true)}
              />

              {/* Camera Icon */}
              <button
                className="absolute bottom-1 right-1 bg-slate-700 hover:bg-slate-800 text-white p-2 rounded-full border-2 border-white shadow-md"
                onClick={() => setShowPopup(true)}
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* USER BASIC INFO */}
        <div className="pt-16 pb-6 text-center px-6">
          <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
          <p className="text-gray-500">{user.email}</p>
          <span className="inline-block mt-2 px-3 py-1 bg-slate-100 rounded-full text-sm text-slate-700">
  {toProperCase(user.role)}
</span>
        </div>
      </div>

      {/* ================================================== */}
      {/* 📌 Profile Details Card (RESTORED) */}
      {/* ================================================== */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-slate-600" />
          Profile Details
        </h3>

        <div className="grid md:grid-cols-2 gap-4">

          {/* Email */}
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <Mail className="w-5 h-5 text-slate-600 mt-1 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500 mb-1">Email</p>
              <p className="text-sm font-medium text-gray-900">{user.email}</p>
            </div>
          </div>

          {user.dateOfBirth && (
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-slate-600 mt-1 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500 mb-1">Date of Birth</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(user.dateOfBirth).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          )}

          {user.mobileNumber && (
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Phone className="w-5 h-5 text-slate-600 mt-1 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500 mb-1">Mobile Number</p>
                <p className="text-sm font-medium text-gray-900">
                  {user.mobileNumber}
                </p>
              </div>
            </div>
          )}

          {user.createdAt && (
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-slate-600 mt-1 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500 mb-1">Joined</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                  })}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================================================== */}
      {/* 🎛 Picture Options Popup */}
      {/* ================================================== */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="pointer-events-auto bg-white w-80 p-6 rounded-xl shadow-xl border border-gray-200 animate-fadeIn">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
              Profile Picture
            </h3>

            <div className="space-y-3">
              <button
                onClick={() => fileInputRef.current.click()}
                className="w-full py-2 px-4 rounded-lg text-slate-800 bg-gray-100 hover:bg-gray-200 transition"
              >
                Upload New Photo
              </button>

              {user.profilePicture && (
                <>
                  <button
                    onClick={handleViewPicture}
                    className="w-full py-2 px-4 rounded-lg text-slate-800 bg-gray-100 hover:bg-gray-200 transition"
                  >
                    View Photo
                  </button>

                  <button
                    onClick={handleRemovePicture}
                    className="w-full py-2 px-4 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
                  >
                    Remove Photo
                  </button>
                </>
              )}

              <button
                onClick={() => setShowPopup(false)}
                className="w-full py-2 px-4 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600"
              >
                Cancel
              </button>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
        </div>
      )}

      {/* ================================================== */}
      {/* 🔍 Full-screen Picture Viewer */}
      {/* ================================================== */}
      {viewPicture && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <button
            onClick={() => setViewPicture(false)}
            className="absolute top-5 right-5 text-white text-3xl"
          >
            ×
          </button>

          <img
            src={user.profilePicture}
            className="max-w-[85%] max-h-[85%] rounded-lg shadow-lg"
          />
        </div>
      )}

      {/* ================================================== */}
      {/* 📝 User's Posts */}
      {/* ================================================== */}
      <div className="mt-10">
        <h3 className="text-xl font-bold text-gray-800 mb-4">My Blog Posts</h3>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : userPosts.length > 0 ? (
          <div className="space-y-5">
            {userPosts.map((post) => (
              <PostCardCategory key={post.id} post={post} user={user} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">You haven't posted anything yet.</p>
        )}
      </div>

    </div>
  );
}

export default Profile;
