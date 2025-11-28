import React, { useState } from "react";
import axios from "axios";

function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        const res = await axios.post("http://localhost:5000/api/contact", {
        name,
        email,
        message,
      });

      alert(res.data.message);
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      console.error("❌ Error sending message:", err);
      alert("Failed to send message. Try again later.");
    }

    setLoading(false);
  };

  return (
    <div className="mt-10 min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex w-full max-w-4xl shadow-xl rounded-xl overflow-hidden">
        
        {/* Left Side (Image) */}
        <div className="hidden md:block w-1/2">
          <img
            src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg"
            alt="contact visual"
            className="object-cover h-full w-full"
          />
        </div>

        {/* Right Side (Form) */}
        <div className="w-full md:w-1/2 bg-gray-100 p-10 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Contact Us</h2>
          <p className="text-sm text-gray-500 mb-6">
            Fill out the form below to get in touch with me.
          </p>

          <form onSubmit={handleSubmit}>
            <label className="font-medium text-gray-700 mb-1 block">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 mb-4 outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition"
              placeholder="Enter your name"
              required
            />

            <label className="font-medium text-gray-700 mb-1 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 mb-4 outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition"
              placeholder="Enter your email"
              required
            />

            <label className="font-medium text-gray-700 mb-1 block">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 mb-5 outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition resize-none"
              placeholder="Write your message"
              rows="5"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="font-medium w-full bg-slate-600 text-white rounded-lg py-3 hover:bg-slate-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;
