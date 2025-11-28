import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      const user = res.data.user;
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      navigate("/");
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex w-full max-w-4xl shadow-xl rounded-xl overflow-hidden">
        <div className="hidden md:block w-1/2">
          <img src="https://images.pexels.com/photos/416320/pexels-photo-416320.jpeg" alt="login visual" className="object-cover h-full w-full" />
        </div>

        <div className="w-full md:w-1/2 bg-gray-100 p-10 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Log In</h2>
          <p className="text-sm text-gray-500 mb-6">Enter your email and password to access the dashboard.</p>

          <form onSubmit={handleLogin}>
            <label className="font-medium text-gray-700 mb-1 block">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border border-gray-300 p-3 mb-4 outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition" placeholder="Enter your email" required />
            <label className="font-medium text-gray-700 mb-1 block">Password</label>
            <input autoComplete="current-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-lg border border-gray-300 p-3 mb-5 outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition" placeholder="Enter your password" required />
            <button type="submit" className="font-medium w-full bg-slate-600 text-white rounded-lg py-3 hover:bg-slate-700 transition-colors shadow-sm">Log in</button>
          </form>

          <div className="flex items-center justify-start mt-4 text-sm">
            <p className="mr-1 text-gray-600">Don't have an account?</p>
            <Link to="/signup" className="text-slate-600 hover:text-slate-700 font-medium transition-colors">Sign Up</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
