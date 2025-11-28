import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export default function Sidebar({ postsLimit = 3, authorsLimit = 3 }) {
  const [trending, setTrending] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsRes, authorsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/sidebar/trending"), // fetch all
          axios.get("http://localhost:5000/api/sidebar/authors"), // fetch all
        ]);
        setTrending(postsRes.data);
        setAuthors(authorsRes.data);
      } catch (err) {
        console.error("Error fetching sidebar data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return (
      <aside className="w-full md:w-1/3 p-4">
        <div className="text-center text-gray-500">Loading sidebar...</div>
      </aside>
    );

  return (
    <aside className="w-full md:w-1/3 p-4 space-y-6">
      {/* Trending Posts */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 relative">
        <h3 className="font-bold text-lg mb-3 text-gray-800">🔥 Trending Posts</h3>

        {/* View All button top-right */}
        <div className="absolute top-4 right-4">
          <button
            onClick={() => navigate("/trending")}
            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition"
            title="View All Trending"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        <ul className="space-y-2 mt-6">
          {trending.slice(0, postsLimit).map((item) => (
            <li
              key={item.id}
              onClick={() => navigate(`/post/${item.id}`)}
              className="cursor-pointer text-gray-700 hover:text-slate-700 hover:underline transition-colors text-sm py-1"
            >
              {item.title || item.subject}
            </li>
          ))}
        </ul>
      </div>

      {/* Authors */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 relative">
        <h3 className="font-bold text-lg mb-3 text-gray-800">👩‍💻 Top Authors</h3>

        {/* View All button top-right */}
        <div className="absolute top-4 right-4">
          <button
            onClick={() => navigate("/all-authors")}
            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition"
            title="View All Authors"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        <ul className="space-y-3 mt-6">
          {authors.slice(0, authorsLimit).map((author) => (
            <li 
              key={author.id} 
              onClick={() => navigate(`/authors/${author.id}`)}
              className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
            >
              <img
                src={
                  author.profile_picture ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    author.name
                  )}&background=e5e7eb&color=4b5563&size=128`
                }
                alt={author.name}
                className="w-10 h-10 rounded-full object-cover border border-gray-200"
              />
              <span className="text-gray-700 hover:text-slate-700 font-medium text-sm">
                {author.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
