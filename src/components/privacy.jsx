import React from "react";
import { Shield, Lock, Eye, Database, UserCheck, Mail } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-slate-600 rounded-2xl flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4" style={{ color: 'oklch(0.446 0.043 257.281)' }}>
            Privacy Policy
          </h1>
          <p className="text-gray-600 text-lg">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
          {/* Introduction */}
          <section>
            <p className="text-gray-700 leading-relaxed">
              At Kick Start, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our blogging platform. Please read this privacy policy carefully.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-6 h-6" style={{ color: 'oklch(0.446 0.043 257.281)' }} />
              <h2 className="text-2xl font-semibold" style={{ color: 'oklch(0.446 0.043 257.281)' }}>
                Information We Collect
              </h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold mb-2">Personal Information</h3>
                <p className="leading-relaxed">
                  We may collect personal information that you voluntarily provide to us when you register on the platform, such as your name, email address, username, and profile information.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Usage Data</h3>
                <p className="leading-relaxed">
                  We automatically collect certain information when you visit, use, or navigate our platform, including your IP address, browser type, operating system, access times, and pages viewed.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Content Data</h3>
                <p className="leading-relaxed">
                  We collect the content you create, post, or share on our platform, including blog posts, comments, and images.
                </p>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <UserCheck className="w-6 h-6" style={{ color: 'oklch(0.446 0.043 257.281)' }} />
              <h2 className="text-2xl font-semibold" style={{ color: 'oklch(0.446 0.043 257.281)' }}>
                How We Use Your Information
              </h2>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full mt-2" style={{ backgroundColor: 'oklch(0.446 0.043 257.281)' }}></span>
                <span>To provide, operate, and maintain our blogging platform</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full mt-2" style={{ backgroundColor: 'oklch(0.446 0.043 257.281)' }}></span>
                <span>To improve, personalize, and expand our services</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full mt-2" style={{ backgroundColor: 'oklch(0.446 0.043 257.281)' }}></span>
                <span>To communicate with you, including sending updates and marketing materials</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full mt-2" style={{ backgroundColor: 'oklch(0.446 0.043 257.281)' }}></span>
                <span>To process your transactions and manage your account</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full mt-2" style={{ backgroundColor: 'oklch(0.446 0.043 257.281)' }}></span>
                <span>To analyze usage patterns and improve user experience</span>
              </li>
            </ul>
          </section>

          {/* Data Security */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-6 h-6" style={{ color: 'oklch(0.446 0.043 257.281)' }} />
              <h2 className="text-2xl font-semibold" style={{ color: 'oklch(0.446 0.043 257.281)' }}>
                Data Security
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              We implement appropriate technical and organizational security measures to protect your personal information. However, no electronic transmission over the internet or information storage technology can be guaranteed to be 100% secure.
            </p>
          </section>

          {/* Your Rights */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-6 h-6" style={{ color: 'oklch(0.446 0.043 257.281)' }} />
              <h2 className="text-2xl font-semibold" style={{ color: 'oklch(0.446 0.043 257.281)' }}>
                Your Privacy Rights
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-3">
              Depending on your location, you may have the following rights regarding your personal information:
            </p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full mt-2" style={{ backgroundColor: 'oklch(0.446 0.043 257.281)' }}></span>
                <span>The right to access and receive a copy of your personal data</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full mt-2" style={{ backgroundColor: 'oklch(0.446 0.043 257.281)' }}></span>
                <span>The right to rectify or update your personal information</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full mt-2" style={{ backgroundColor: 'oklch(0.446 0.043 257.281)' }}></span>
                <span>The right to delete your personal data</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full mt-2" style={{ backgroundColor: 'oklch(0.446 0.043 257.281)' }}></span>
                <span>The right to object to or restrict processing of your data</span>
              </li>
            </ul>
          </section>

          {/* Contact */}
          <section className="border-t border-gray-200 pt-8">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-6 h-6" style={{ color: 'oklch(0.446 0.043 257.281)' }} />
              <h2 className="text-2xl font-semibold" style={{ color: 'oklch(0.446 0.043 257.281)' }}>
                Contact Us
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:
            </p>
            <a 
              className="inline-block mt-3 px-6 py-3 bg-slate-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
            >
              hasnainahmad3453@gmail.com
            </a>
          </section>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <a 
            href="/"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
             Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}