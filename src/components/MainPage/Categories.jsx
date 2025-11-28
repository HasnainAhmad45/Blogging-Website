// src/components/Categories.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const categories = ["Tech", "Lifestyle", "Business", "Travel", "Food", "Health"];

export default function Categories({ onSelect }) {
  const navigate = useNavigate();

  const handleClick = (cat) => {
    console.log("Category clicked:", cat); // debug line
    if (typeof onSelect === "function") {
      onSelect(cat);
    } else {
      // fallback: navigate to a category route (ensure you have this route)
      navigate(`/category/${encodeURIComponent(cat)}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 mt-8 mb-6">
      <div className="flex flex-wrap gap-3 justify-center">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleClick(cat)}
            className="px-5 py-2.5 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm font-medium shadow-sm hover:shadow-md"
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
