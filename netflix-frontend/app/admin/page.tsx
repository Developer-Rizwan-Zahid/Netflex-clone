"use client";

import { useState, useEffect, ChangeEvent } from "react";
import API from "../services/api";

interface Content {
  id: string;
  title: string;
  genre: string;
  type: string;
  releaseDate: string;
  rating: number;
  thumbnailUrl: string;
  videoKey: string;
  hlsPlaylist: string;
}

export default function AdminDashboard() {
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    genre: "",
    type: "Movie",
    rating: 0,
    thumbnailUrl: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch all content
  const fetchContent = async () => {
    try {
      const res = await API.get("/content");
      setContents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  // Handle form changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // Upload video
  const handleUpload = async () => {
    if (!file) {
      setError("Please select a video file.");
      return;
    }

    setUploading(true);
    setError("");
    setSuccess("");

    try {
      const data = new FormData();
      data.append("File", file);
      data.append("Title", formData.title);
      data.append("Genre", formData.genre);
      data.append("Type", formData.type);
      data.append("Rating", formData.rating.toString());
      data.append("ThumbnailUrl", formData.thumbnailUrl);

      const res = await API.post("/content/upload", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess("Content uploaded successfully!");
      setFile(null);
      setFormData({ title: "", genre: "", type: "Movie", rating: 0, thumbnailUrl: "" });
      fetchContent();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <p className="text-white p-8">Loading...</p>;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Upload Form */}
      <section className="mb-12 bg-gray-900 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Upload New Content</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        {success && <p className="text-green-500 mb-2">{success}</p>}

        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="p-2 rounded bg-gray-800 border border-gray-700"
          />
          <input
            type="text"
            placeholder="Genre"
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            className="p-2 rounded bg-gray-800 border border-gray-700"
          />
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="p-2 rounded bg-gray-800 border border-gray-700"
          >
            <option value="Movie">Movie</option>
            <option value="Series">Series</option>
          </select>
          <input
            type="number"
            placeholder="Rating (0-10)"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            className="p-2 rounded bg-gray-800 border border-gray-700"
          />
          <input
            type="text"
            placeholder="Thumbnail URL"
            name="thumbnailUrl"
            value={formData.thumbnailUrl}
            onChange={handleChange}
            className="p-2 rounded bg-gray-800 border border-gray-700"
          />
          <input type="file" accept="video/*" onChange={handleFileChange} />
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="bg-red-600 py-2 rounded hover:bg-red-700 mt-2"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </section>

      {/* Content Table */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">All Content</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {contents.map((c) => (
            <div key={c.id} className="bg-gray-900 rounded-lg overflow-hidden shadow-md">
              {c.thumbnailUrl ? (
                <img src={c.thumbnailUrl} alt={c.title} className="w-full h-48 object-cover" />
              ) : (
                <div className="w-full h-48 bg-gray-700 flex items-center justify-center text-gray-300">
                  No Image
                </div>
              )}
              <div className="p-4">
                <h3 className="font-bold text-lg">{c.title}</h3>
                <p className="text-gray-400 text-sm">
                  {c.genre} • {c.type}
                </p>
                <p className="text-gray-400 text-sm">Rating: {c.rating}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
