import React from "react";

export default function Footer() {
  return (
    <footer className="bg-slate-800 text-gray-300 py-8 mt-16 border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center">
          <p className="text-gray-400">© {new Date().getFullYear()} Kick Start. All rights reserved.</p>
          <p className="text-sm text-gray-500 mt-2">A modern blogging platform for sharing your thoughts and ideas.</p>
        </div>
      </div>
    </footer>
  );
}
                                    