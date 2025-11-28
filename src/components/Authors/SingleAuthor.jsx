import React, { useEffect, useState } from "react";
import axios from "axios";
import PostCardCategory from "../CategoryPosts/PostCardCategory";
import { useParams } from "react-router-dom";
import { User, Mail, Calendar, Phone } from "lucide-react";

export default function AuthorPage({ user }) {
  const { id } = useParams(); // author ID from URL
  const [author, setAuthor] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchAuthor = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/authordetails/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        setAuthor(res.data.author);
        setBlogs(res.data.blogs);
      } catch (err) {
        console.error("Error fetching author:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthor();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-[3px] border-slate-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  if (!author) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-gray-500">Author not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Author Header Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        {/* Cover Photo */}
        <div className="h-48 bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800 relative">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
            <img
              src={
                author.profile_picture ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  author.name
                )}&background=e5e7eb&color=4b5563&size=200`
              }
              alt={author.name}
              className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover"
            />
          </div>
        </div>

        {/* Author Info */}
        <div className="pt-20 pb-6 px-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{author.name}</h1>
          <p className="text-gray-500 text-sm mb-3">{author.email}</p>
          <span className="inline-block px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
            Author
          </span>
        </div>
      </div>

      {/* 📌 Profile Details Card */}
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
              <p className="text-sm font-medium text-gray-900">{author.email}</p>
            </div>
          </div>

          {/* Date of Birth */}
          {author.dateOfBirth && (
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-slate-600 mt-1 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500 mb-1">Date of Birth</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(author.dateOfBirth).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          )}

          {/* Joined Date */}
          {author.createdAt && (
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-slate-600 mt-1 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500 mb-1">Joined</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(author.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                  })}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Author Blogs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          Blog Posts ({blogs.length})
        </h3>
        {blogs.length > 0 ? (
          <div className="space-y-6">
            {blogs.map((post) => (
              <PostCardCategory key={post.id} post={post} user={user} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No posts published yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
