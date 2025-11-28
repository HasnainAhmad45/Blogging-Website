import React from "react";

const About = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white rounded-2xl shadow-lg max-w-4xl w-full p-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
          About Us
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed mb-6">
          Welcome to <span className="font-semibold">Kick Start</span> – a
          creative space built for writers, readers, and dreamers. Our mission
          is to empower people from all walks of life to share their voices,
          stories, and ideas with the world. Whether you are an experienced
          blogger or just starting your journey, Kick Start gives you the
          platform to express yourself and connect with like-minded people.
        </p>

        <p className="text-lg text-gray-600 leading-relaxed mb-6">
          We believe that words have the power to inspire, educate, and bring
          positive change. That’s why we’ve designed this platform to be simple,
          modern, and community-driven. From personal stories to professional
          insights, every post here contributes to a bigger picture – a global
          conversation.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
          What We Offer
        </h2>
        <ul className="list-disc list-inside text-gray-600 text-lg space-y-2 mb-6">
          <li>📖 Easy-to-use blogging tools to share your thoughts.</li>
          <li>🌍 A global community of readers and writers.</li>
          <li>💬 Space for meaningful discussions through comments & likes.</li>
          <li>🛡️ Admin approval system for quality content publishing.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
          Our Vision
        </h2>
        <p className="text-lg text-gray-600 leading-relaxed mb-6">
          Our vision is to become a hub for creativity and knowledge sharing.
          We’re not just a blogging platform – we’re building a digital space
          where ideas can grow, voices can be heard, and communities can thrive.
        </p>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mt-8 text-center">
          <h3 className="text-xl font-semibold text-slate-700 mb-3">
            Join the Journey
          </h3>
          <p className="text-gray-600 text-lg">
            Whether you want to inspire others, share knowledge, or just express
            yourself. Kick Start is your home. Start writing today and become
            part of something bigger!
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
