import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { Heart, MessageCircle, Share2, ChevronLeft, ChevronRight } from "lucide-react";

// Helper: format time nicely
function formatTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);

  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);

  if (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  ) {
    return `Yesterday at ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }

  if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return date.toLocaleDateString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Helper: Shuffle array to get random posts
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function Hero() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollContainerRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/latest")
      .then((res) => {
        if (res.data && Array.isArray(res.data)) {
          // Shuffle and take up to 5 random posts
          const shuffled = shuffleArray(res.data);
          setPosts(shuffled.slice(0, 5));
        } else {
          setPosts([]);
        }
        setError(null);
      })
      .catch((err) => {
        console.error("Error fetching posts:", err);
        setError(err.response?.data?.error || err.message || "Failed to load posts");
        setPosts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handlePostClick = (postId, e) => {
    // Avoid self loop - don't navigate if already on this post
    if (location.pathname === `/post/${postId}`) {
      e.preventDefault();
      return;
    }
  };

  const handleAuthorClick = (userId, e) => {
    if (!userId) {
      console.error("Author ID not found in post");
      e.preventDefault();
      alert("Author information not available");
      return;
    }
    
    // Avoid self loop - don't navigate if already on this author's page
    if (location.pathname === `/authors/${userId}`) {
      e.preventDefault();
      return;
    }
  };

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-6 mt-6">
        <div className="flex justify-center items-center h-80">
          <div className="w-8 h-8 border-[3px] border-gray-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </section>
    );
  }

  if (posts.length === 0 && !loading) {
    return (
      <section className="max-w-7xl mx-auto px-6 mt-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          {error ? (
            <div>
              <p className="text-red-500 mb-2">Error: {error}</p>
              <p className="text-sm text-gray-500">Please check if the backend server is running on port 5000</p>
            </div>
          ) : (
            <p className="text-gray-500">No posts available yet.</p>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 mt-6 relative">      
      {/* Scroll Container */}
      <div className="relative">
        {/* Left Scroll Button */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>

        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {posts.map((post) => (
            <article
              key={post.id}
              className="flex-shrink-0 w-80 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col"
            >
              {/* Header */}
              <header className="flex items-center gap-3 p-4 pb-3">
                <Link
                  to={post.userId ? `/authors/${post.userId}` : "#"}
                  onClick={(e) => handleAuthorClick(post.userId, e)}
                  className="flex-shrink-0"
                >
                  <img
                    src={
                      post.authorAvatar
                        ? post.authorAvatar
                        : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            post.authorName || "User"
                          )}&background=e5e7eb&color=4b5563&size=128`
                    }
                    alt={post.authorName}
                    className="w-10 h-10 rounded-full object-cover border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
                  />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link
                    to={post.userId ? `/authors/${post.userId}` : "#"}
                    onClick={(e) => handleAuthorClick(post.userId, e)}
                    className="font-semibold text-gray-900 hover:underline block truncate"
                  >
                    {post.authorName}
                  </Link>
                  <p className="text-xs text-gray-500">
                    {formatTimeAgo(post.createdAt)}
                  </p>
                </div>
              </header>

              {/* Content - grows to fill space */}
              <Link
                to={`/post/${post.id}`}
                onClick={(e) => handlePostClick(post.id, e)}
                className="block flex-grow"
              >
                <div className="px-4 pt-3 pb-3">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-gray-700">
                    {post.title || post.subject}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {post.text}
                  </p>
                </div>
              </Link>

              {/* Bottom Section - Engagement Stats and Read More */}
              <div className="mt-auto border-t border-gray-100">
                {/* Engagement Stats */}
                {(post.likesCount > 0 || post.commentsCount > 0 || post.category) && (
                  <div className="px-4 pt-3 pb-2 flex items-center gap-3 text-sm text-gray-600">
                    {post.likesCount > 0 && (
                      <span className="flex items-center gap-1">
                        <Heart className="w-4 h-4 fill-current" />
                        {post.likesCount}
                      </span>
                    )}
                    {post.commentsCount > 0 && (
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        {post.commentsCount}
                      </span>
                    )}
                    {post.category && (
                      <span className="ml-auto text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                        {post.category}
                      </span>
                    )}
                  </div>
                )}

                {/* Action Button */}
                <div className="px-4 pb-4">
                  <Link
                    to={`/post/${post.id}`}
                    onClick={(e) => handlePostClick(post.id, e)}
                    className="block w-full text-center bg-slate-600 hover:bg-slate-700 text-white py-2 rounded-lg transition-colors text-sm font-medium"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Right Scroll Button */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      {/* Hide scrollbar for webkit browsers */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
