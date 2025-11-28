import React, { useEffect, useState } from "react";
import axios from "axios";
import PostCardCategory from "../CategoryPosts/PostCardCategory";

export default function AllTrending({ user }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/sidebar/trending")
      .then((res) => setPosts(res.data))
      .catch((err) => console.error("Error fetching trending posts:", err));
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 mt-12">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
        🔥 All Trending Posts
      </h2>
      {posts.length ? (
        posts.map((post) => (
          <PostCardCategory key={post.id} post={post} user={user} />
        ))
      ) : (
        <p className="text-center text-gray-600">No trending posts found.</p>
      )}
    </div>
  );
}
