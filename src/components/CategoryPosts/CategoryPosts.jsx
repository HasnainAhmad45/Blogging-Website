// src/components/CategoryPosts.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import PostCardCategory from "./PostCardCategory";

export default function CategoryPosts({ user }) {
  const { category } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5000/api/posts/category/${encodeURIComponent(category)}`,
          token ? { headers: { Authorization: `Bearer ${token}` } } : {}
        );
        if (!cancelled) setPosts(res.data);
      } catch (err) {
        console.error("Failed to fetch category posts:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchPosts();
    return () => {
      cancelled = true;
    };
  }, [category]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{category} Posts</h1>
        <Link to="/" className="text-sm text-slate-600 hover:text-slate-700 font-medium transition-colors">Back to home</Link>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading posts...</p>
      ) : posts.length === 0 ? (
        <p className="text-center text-gray-500">No posts in this category yet.</p>
      ) : (
        <div className="space-y-6">
          {posts.map((p) => (
            <PostCardCategory key={p.id} post={p} user={user} />
          ))}
        </div>
      )}
    </div>
  );
}
