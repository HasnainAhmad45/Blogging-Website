import React, { useEffect, useState } from "react";
import axios from "axios";
import PostCardCategory from "../CategoryPosts/PostCardCategory";

export default function AllPosts({ user }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/latest")
      .then((res) => setPosts(res.data))
      .catch((err) => console.error("Error fetching all posts:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-40">
        <div className="w-8 h-8 border-[3px] border-slate-400 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-3 text-gray-600 font-medium">Loading posts...</span>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto px-4 mt-12">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
        All Latest Blogs
      </h2>

      {posts.length > 0 ? (
        posts.map((post) => (
          <PostCardCategory key={post.id} post={post} user={user} />
        ))
      ) : (
        <p className="text-center text-gray-600">No posts available yet.</p>
      )}
    </div>
  );
}
