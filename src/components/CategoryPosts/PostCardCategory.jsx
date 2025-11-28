import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { ThumbsUp, Share2, MessageCircle } from "lucide-react";
import { useNavigate, useParams, useLocation, Link } from "react-router-dom";

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

export default function PostCardCategory({ post, user, refreshPosts }) {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const location = useLocation();
  const { id: currentAuthorId, id: postId } = useParams(); // current author page ID or post ID
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [liked, setLiked] = useState(post.userLiked || false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const commentInputRef = useRef(null);
  
  // Check if we're on a single post page
  const isSinglePost = location.pathname.startsWith("/post/");

  // Fetch comments
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/posts/${post.id}/comments`)
      .then((res) => setComments(res.data || []))
      .catch((err) => console.error("Fetch comments error:", err));
  }, [post.id]);

  // Fetch like status
  useEffect(() => {
    if (!token) return;
    axios
      .get(`http://localhost:5000/api/posts/${post.id}/status`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setLiked(res.data.userLiked);
        setLikesCount(res.data.likesCount);
      })
      .catch(() => {});
  }, [post.id, token]);

  // Like/unlike post
  const handleLike = async (e) => {
    e.preventDefault();
    if (!token) return alert("Please log in to like posts.");

    try {
      const res = await axios.post(
        `http://localhost:5000/api/posts/${post.id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLiked(res.data.liked);
      setLikesCount(res.data.likesCount);
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  const handleCommentFocus = () => commentInputRef.current?.focus();

  const handleCommentPost = async (e) => {
    e.preventDefault();
    if (!token) return alert("Please log in to comment.");
    if (!commentText.trim()) return;

    try {
      const res = await axios.post(
        `http://localhost:5000/api/posts/${post.id}/comment`,
        { content: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newComment = {
        id: res.data.commentId || Date.now(),
        userName: user?.name || "You",
        content: commentText,
        createdAt: new Date().toISOString(),
      };

      setComments([newComment, ...comments]);
      setCommentText("");
    } catch (err) {
      console.error("Comment error:", err);
    }
  };

  const handleShare = async () => {
    const postUrl = `${window.location.origin}/post/${post.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.subject || "Post",
          text: post.text || "",
          url: postUrl,
        });
      } catch {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(postUrl);
      alert("Post link copied to clipboard!");
    }
  };

  const handleAuthorClick = (e) => {
    // Get userId from post (try different possible field names)
    const authorId = post.userId || post.user_id || post.authorId;
    
    if (!authorId) {
      console.error("Author ID not found in post:", post);
      e.preventDefault();
      alert("Author information not available");
      return;
    }
    
    // Avoid self loop - don't navigate if already on this author's page
    if (location.pathname === `/authors/${authorId}`) {
      e.preventDefault();
      return;
    }
    navigate(`/authors/${authorId}`);
  };
  
  // Get userId for use in JSX (try different possible field names)
  const authorId = post.userId || post.user_id || post.authorId;

  const handlePostClick = (e) => {
    // Avoid self loop - don't navigate if already on this post
    if (location.pathname === `/post/${post.id}`) {
      e.preventDefault();
      return;
    }
  };



  return (
    <article className="bg-white shadow-sm border border-gray-200 rounded-xl p-5 mb-6">
      {/* Header */}
      <header className="flex items-center gap-3">
        <Link
          to={authorId ? `/authors/${authorId}` : "#"}
          onClick={(e) => handleAuthorClick(e)}
          className="flex-shrink-0"
        >
          <img
            src={
              post.authorAvatar
                ? post.authorAvatar
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    post.authorName
                  )}&background=e5e7eb&color=4b5563&size=128`
            }
            alt="user"
            className="w-10 h-10 rounded-full object-cover cursor-pointer border border-gray-200 hover:opacity-90 transition-opacity"
          />
        </Link>
        <div>
          <Link
            to={authorId ? `/authors/${authorId}` : "#"}
            onClick={(e) => handleAuthorClick(e)}
            className="font-semibold cursor-pointer text-gray-900 hover:text-slate-700 transition-colors block"
          >
            {post.authorName}
          </Link>
          <p className="text-xs text-gray-500">{formatTimeAgo(post.createdAt)}</p>
        </div>
      </header>

      {/* Content */}
      {isSinglePost ? (
        <div className="mt-3">
          <h3 className="font-bold text-2xl text-gray-900 mb-4">
            {post.subject}
          </h3>
          <div className="prose max-w-none">
            <p className="text-gray-700 text-base leading-relaxed whitespace-pre-wrap">
              {post.text}
            </p>
          </div>

          {post.image && (
            <div className="relative w-full mt-6 overflow-hidden rounded-xl bg-gray-50 flex justify-center">
              <img
                src={post.image}
                alt="post"
                className="max-w-[300px] max-h-[300px] w-auto h-auto object-contain rounded-xl bg-gray-50"
              />
            </div>
          )}
        </div>
      ) : (
        <Link
          to={`/post/${post.id}`}
          onClick={handlePostClick}
          className="block mt-3"
        >
          <h3 className="font-bold text-lg text-gray-900 hover:text-slate-700 transition-colors">
            {post.subject}
          </h3>
          <p className="text-gray-700 line-clamp-3">{post.text}</p>
        </Link>
      )}

      {/* Likes */}
      <div className="text-sm text-gray-600 mt-2">
        {likesCount > 0 ? `${likesCount} ❤️` : "Be the first to like this ❤️"}
      </div>

      {/* Buttons */}
      <div className="flex justify-around border-t border-gray-100 mt-3 pt-3 text-gray-600">
        <button
          type="button"
          onClick={handleLike}
          className={`flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-gray-100 transition-colors ${
            liked ? "text-slate-700 font-semibold" : "text-gray-600"
          }`}
        >
          <ThumbsUp size={18} />
          {liked ? "Liked" : "Like"}
        </button>

        <button
          type="button"
          onClick={handleCommentFocus}
          className="flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <MessageCircle size={18} />
          Comment
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Share2 size={18} />
          Share
        </button>
      </div>

      {/* Comments */}
      <div className="mt-3 space-y-2">
        <form onSubmit={handleCommentPost} className="flex gap-2">
          <input
            ref={commentInputRef}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none transition"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-slate-600 text-white rounded-full text-sm hover:bg-slate-700 transition-colors font-medium"
          >
            Post
          </button>
        </form>

        {comments.map((c) => (
          <div key={c.id} className="flex gap-2 items-start">
            <img
              src={
                c.userAvatar
                  ? c.userAvatar
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      c.userName
                    )}&background=e5e7eb&color=4b5563&size=128`
              }
              alt="commenter"
              className="w-8 h-8 rounded-full object-cover"
            />

            <div className="bg-gray-50 border border-gray-200 p-3 pt-1 rounded-lg w-fit max-w-[80%]">
              <div className="text-sm font-medium">{c.userName}</div>
              <div className="text-xs text-gray-500">
                {formatTimeAgo(c.createdAt)}
              </div>
              <div className="text-sm text-gray-700">{c.content}</div>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
