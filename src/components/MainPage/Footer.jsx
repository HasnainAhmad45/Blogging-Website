import React from "react";
import { Github, Linkedin, Mail, Instagram } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Footer({ user }) { // Accept user prop
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();

  const handleJoinUsClick = (e) => {
    e.preventDefault();
    
    // Check if user is already logged in
    const token = localStorage.getItem("token");
    
    if (token || user) {
      alert("You are already logged in!");
    } else {
      navigate("/login");
    }
  };

  return (
    <footer className="mt-10 bg-gradient-to-b from-gray-50 to-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
          {/* Brand Section */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-2xl font-bold text-gray-900">Kick Start</h3>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4 max-w-md">
              A modern blogging platform empowering writers to share their stories, 
              ideas, and insights with a global audience.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3">
            <h3 className="text-gray-900 font-semibold mb-4 text-lg">Navigation</h3>
            <ul className="space-y-3">
              <li>
                <a 
                  href="/about" 
                  className="transition-colors flex items-center group"
                  style={{ color: 'oklch(0.446 0.043 257.281)' }}
                >
                  <span 
                    className="w-1.5 h-1.5 rounded-full mr-2 transition-colors"
                    style={{ backgroundColor: 'oklch(0.446 0.043 257.281)' }}
                  ></span>
                  About us
                </a>
              </li>
              <li>
                <a 
                  href="/contact" 
                  className="transition-colors flex items-center group"
                  style={{ color: 'oklch(0.446 0.043 257.281)' }}
                >
                  <span 
                    className="w-1.5 h-1.5 rounded-full mr-2 transition-colors"
                    style={{ backgroundColor: 'oklch(0.446 0.043 257.281)' }}
                  ></span>
                  Contact Us
                </a>
              </li>
              <li>
                <a 
                  href="/login" 
                  onClick={handleJoinUsClick}
                  className="transition-colors flex items-center group cursor-pointer"
                  style={{ color: 'oklch(0.446 0.043 257.281)' }}
                >
                  <span 
                    className="w-1.5 h-1.5 rounded-full mr-2 transition-colors"
                    style={{ backgroundColor: 'oklch(0.446 0.043 257.281)' }}
                  ></span>
                  Join us
                </a>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="md:col-span-4">
            <h3 style={{ color: 'oklch(0.446 0.043 257.281)' }} className="font-semibold mb-4 text-lg">Stay Connected</h3>
            <p style={{ color: 'oklch(0.446 0.043 257.281)' }} className="text-sm mb-4">
              Follow us on social media for updates, tips, and inspiration.
            </p>
            <div className="flex gap-3">
              <a 
                href="https://www.instagram.com/about_hasnain/" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-100 hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 text-gray-700 hover:text-white rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="https://github.com/HasnainAhmad45" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-100 hover:bg-gray-900 text-gray-700 hover:text-white rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
              <a 
                href="https://www.linkedin.com/in/hasnain-ahmad-52a370281/" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-100 hover:bg-blue-600 text-gray-700 hover:text-white rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">
              © {currentYear} Kick Start. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-600">
              <a href="/privacy" className="hover:text-slate-700 transition-colors">Privacy Policy</a>
              <a href="/privacy" className="hover:text-slate-700 transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}