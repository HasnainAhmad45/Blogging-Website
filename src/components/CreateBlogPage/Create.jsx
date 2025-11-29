import React, { useState } from "react";
import axios from "axios";
import { Card } from "@/components/ui/Card";
import { CardContent } from "@/components/ui/CardContent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Upload,
  Send,
  ThumbsUp,
  Share2,
  MessageSquare,
} from "lucide-react";
import AiGenerator from "./AiGenerator";

const categories = ["Tech", "Lifestyle", "Business", "Travel", "Food", "Health"];

export default function CreateBlog({ user }) {
  const [subject, setSubject] = useState("");
  const [text, setText] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageDetails, setImageDetails] = useState(null);
  const [draftBlog, setDraftBlog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Restrict access to authors
  if (!user || user.role !== "author") {
    return (
      <div className="flex justify-center items-center h-screen">
        <Card className="p-6 shadow-lg text-center">
          <h2 className="text-xl font-bold mb-2">Access Denied</h2>
          <p className="text-gray-600">
            You must be logged in as an Author to publish blogs.
          </p>
        </Card>
      </div>
    );
  }

  // ---------- Image Upload ----------
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      setError("Only JPG and PNG files are allowed!");
      setImage(null);
      setImagePreview(null);
      setImageDetails(null);
      return;
    }

    setError("");
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    setImageDetails({
      name: file.name,
      size: (file.size / 1024).toFixed(2) + " KB",
    });
  };

  // ---------- Save Draft ----------
  const handleSaveDraft = async () => {
    if (!subject.trim() || !text.trim() || !category)
      return alert("Please fill all required fields.");

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      let imageUrl = null;

      if (image) {
        const formData = new FormData();
        formData.append("image", image);

        const uploadRes = await axios.post(
          "http://localhost:5000/api/upload",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        imageUrl = uploadRes.data.url;
      }

      const res = await axios.post(
        "http://localhost:5000/api/blogs",
        { subject, text, category, image: imageUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setDraftBlog({
        ...res.data,
        subject,
        text,
        category,
        image: imageUrl,
        status: "draft",
      });

      alert("✅ Draft saved successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to save draft. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  // ---------- Publish Draft ----------
  const handlePublishDraft = async () => {
    if (!draftBlog) return;
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/blogs/publish/${draftBlog.blogId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setDraftBlog({ ...draftBlog, status: "published" });
      alert("🎉 Blog published successfully!");

      // Reset form
      setSubject("");
      setText("");
      setCategory("");
      setImage(null);
      setImagePreview(null);
      setImageDetails(null);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to publish blog.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Flex container to place blog form on left and AI generator on right */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Side: Blog Form */}
        <div className="flex-1">
          <Card className="shadow-xl rounded-2xl mb-6 lg:mb-0">
            <CardContent className="p-6 space-y-4">
              <h1 className="text-2xl font-bold mb-4">📝 Write a New Blog</h1>

              <Input
                type="text"
                placeholder="Enter Blog Subject (required)"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />

              <Textarea
                placeholder="Write your blog content (required)"
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={5}
              />

              {/* Category Selector */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Select Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-sm bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 p-2"
                >
                  <option value="">-- Choose category --</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Image Upload */}
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Upload className="w-5 h-5" />
                  <span>Upload Picture (optional)</span>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>

                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="preview"
                    className="rounded-lg w-full mt-2"
                  />
                )}

                {imageDetails && (
                  <p className="text-sm text-gray-600">
                    <strong>{imageDetails.name}</strong> ({imageDetails.size})
                  </p>
                )}
                {error && <p className="text-sm text-red-500">{error}</p>}
              </div>

              {/* Buttons */}
              <Button
                className="w-full flex items-center justify-center gap-2 mt-4"
                onClick={handleSaveDraft}
                disabled={loading}
              >
                <Send className="w-4 h-4" />{" "}
                {loading ? "Saving Draft..." : "Save Draft"}
              </Button>
            </CardContent>
          </Card>

          {/* Draft Preview */}
          {draftBlog && (
            <Card className="mt-6 shadow-lg rounded-2xl">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold flex justify-between items-center">
                  {draftBlog.subject}
                  <span
                    className={`px-3 py-1 rounded-full text-white font-medium ${
                      draftBlog.status === "published"
                        ? "bg-green-500"
                        : "bg-yellow-500"
                    }`}
                  >
                    {draftBlog.status}
                  </span>
                </h2>

                {draftBlog.text && (
                  <p className="mt-2 text-gray-700">{draftBlog.text}</p>
                )}
                {draftBlog.image && (
                  <img
                    src={draftBlog.image}
                    alt="blog"
                    className="w-full rounded-lg mt-4"
                  />
                )}

                <div className="flex gap-6 mt-4 text-gray-600">
                  <button className="flex items-center gap-1 hover:text-slate-700 transition-colors">
                    <ThumbsUp className="w-5 h-5" /> Like
                  </button>
                  <button className="flex items-center gap-1 hover:text-slate-700 transition-colors">
                    <Share2 className="w-5 h-5" /> Share
                  </button>
                  <button className="flex items-center gap-1 hover:text-slate-700 transition-colors">
                    <MessageSquare className="w-5 h-5" /> Comment
                  </button>
                </div>

                {draftBlog.status === "draft" && (
                  <Button
                    className="w-full flex items-center justify-center gap-2 mt-6"
                    onClick={handlePublishDraft}
                    disabled={loading}
                  >
                    <Send className="w-4 h-4" />
                    {loading ? "Publishing..." : "Publish Blog"}
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Side: AI Generator */}
        <div className="w-full lg:w-1/3">
          <Card className="shadow-xl rounded-2xl sticky top-6">
            <CardContent>
              <AiGenerator />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
