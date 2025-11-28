import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import PostCardCategory from "../CategoryPosts/PostCardCategory";

export default function SinglePost({ user }) {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/blogs/${id}`)
      .then((res) => setPost(res.data))
      .catch((err) => console.error("Error fetching post:", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-40">
        <div className="w-8 h-8 border-[3px] border-slate-400 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-3 text-gray-600 font-medium">Loading post...</span>
      </div>
    );

  if (!post)
    return (
      <p className="text-center text-gray-600 mt-10">Post not found.</p>
    );

  return (
    <div className="max-w-3xl mx-auto px-4 mt-12">
      <PostCardCategory post={post} user={user} />
    </div>
  );
}
