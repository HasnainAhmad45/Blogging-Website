import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AllAuthors() {
  const [authors, setAuthors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/sidebar/authors")
      .then((res) => setAuthors(res.data))
      .catch((err) => console.error("Error fetching authors:", err));
  }, []);

  const handleAuthorClick = (authorId) => {
    navigate(`/authors/${authorId}`);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 mt-12">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
        👩‍💻 All Authors
      </h2>
      <div className="grid gap-4">
        {authors.length ? (
          authors.map((author) => (
            <div
              key={author.id}
              className="flex items-center gap-3 bg-white p-4 rounded-lg shadow cursor-pointer hover:bg-gray-50 transition"
              onClick={() => handleAuthorClick(author.id)}
            >
              <img
                src={
                  author.profile_picture ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    author.name
                  )}&background=random`
                }
                alt={author.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h4 className="font-semibold">{author.name}</h4>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">No authors found.</p>
        )}
      </div>
    </div>
  );
}
