import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/MainPage/Header";
import Footer from "./components/MainPage/Footer";
import Hero from "./components/MainPage/Hero";
import Categories from "./components/MainPage/Categories";
import LatestPosts from "./components/MainPage/LatestPosts";
import Sidebar from "./components/MainPage/Sidebar";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import Contact from "./components/Contact/Contact";
import About from "./components/About/About";
import Start from "./components/CreateBlogPage/Create";
import Profile from "./components/Profile/Profile";
import CategoryPosts from "./components/CategoryPosts/CategoryPosts";
import AllPosts from "./components/LatestPosts/LatestPosts";
import SinglePost from "./components/SinglePost/SinglePost";
import AllAuthors from "./components/Authors/Authors";
import AllTrending from "./components/TrendingPosts/Trending";
import AuthorDetails from "./components/Authors/SingleAuthor";

export default function App() {
  // ✅ Initialize user from localStorage
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Optional: verify token on mount
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Token invalid");
        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.warn("Token verification failed:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      }
    };
    verifyToken();
  }, []);

  return (
    <Router>
      <div className="bg-gray-50 min-h-screen flex flex-col">
        <Header user={user} setUser={setUser} />
        <div className="flex-grow">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Hero />
                  <Categories />
                  <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row mt-12 gap-6">
                    <div className="md:w-2/3">
                      <LatestPosts />
                    </div>
                    <Sidebar />
                  </div>
                </>
              }
            />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/signup" element={<Signup setUser={setUser} />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/start" element={<Start user={user} />} />
            <Route
              path="/profile"
              element={<Profile user={user} setUser={setUser} />}
            />
            <Route
              path="/category/:category"
              element={<CategoryPosts user={user} />}
            />
            <Route path="/all-posts" element={<AllPosts user={user} />} />
            <Route path="/post/:id" element={<SinglePost user={user} />} />
            <Route path="/all-authors" element={<AllAuthors />} />
            <Route path="/authors/:id" element={<AuthorDetails />} />
            <Route path="/trending" element={<AllTrending user={user} />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}
