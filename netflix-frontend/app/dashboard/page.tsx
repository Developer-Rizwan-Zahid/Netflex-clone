"use client";

import { useEffect, useState } from "react";
import API from "../services/api";
import { useRouter } from "next/navigation";

interface Profile {
  id: string;
  name: string;
}

interface Content {
  id: string;
  title: string;
  genre: string;
  type: string;
  releaseDate: string;
  rating: number;
  thumbnailUrl: string;
}

export default function DashboardPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await API.get("/profile");
        setProfiles(profileRes.data);

        const contentRes = await API.get("/content");
        setContents(contentRes.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <p className="text-xl">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold mb-6">Welcome to MyNetflix</h1>
      {/* Content */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Available Content</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {contents.map((content) => (
            <div
              key={content.id}
              className="bg-gray-900 rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300"
            >
              {content.thumbnailUrl ? (
                <img
                  src={content.thumbnailUrl}
                  alt={content.title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-700 flex items-center justify-center text-gray-300">
                  No Image
                </div>
              )}
              <div className="p-3">
                <h3 className="font-bold text-lg">{content.title}</h3>
                <p className="text-gray-400 text-sm">
                  {content.genre} • {content.type} • {new Date(content.releaseDate).getFullYear()}
                </p>
                <p className="text-gray-400 text-sm">Rating: {content.rating}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
