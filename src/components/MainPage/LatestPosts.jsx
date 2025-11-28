import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react"; // icon for ">" button

export default function LatestPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/latest")
      .then((res) => setPosts(res.data))
      .catch((err) => console.error("❌ Error fetching posts:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="w-8 h-8 border-[3px] border-slate-400 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-3 text-gray-600 font-medium">Loading posts...</span>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 mt-12 relative">
      {/* Heading + Arrow Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Latest Blogs</h2>
        <button
          onClick={() => navigate("/all-posts")}
          className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition"
          title="View All Blogs"
        >
          <ChevronRight className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      {/* Posts Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.slice(0, 3).map((post) => (
          <Link
            key={post.id}
            to={`/post/${post.id}`}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden border border-gray-100 flex flex-col"
          >
            <div className="p-4 flex-grow flex flex-col">
              <h3 className="text-lg font-semibold text-gray-800 line-clamp-3">
                {post.title || post.subject}
              </h3>
              <p className="text-gray-600 text-sm mt-2 line-clamp-4">
                {post.text}
              </p>
              <div className="flex justify-between items-center mt-auto pt-4 text-sm text-gray-500">
                <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md text-xs font-medium">
                  {post.category}
                </span>
                <span className="text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString("en-GB")}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
