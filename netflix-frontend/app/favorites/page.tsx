"use client";

import { useEffect, useState } from "react";
import API from "../services/api";

interface Content {
  id: string;
  title: string;
  genre: string;
  type: string;
  releaseDate: string;
  rating: number;
  thumbnailUrl: string;
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await API.get("/favorites"); // backend endpoint
        setFavorites(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const removeFromFavorites = async (id: string) => {
    try {
      await API.delete(`/favorites/${id}`);
      setFavorites((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Failed to remove from favorites", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <p>Loading your favorites...</p>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
        <h1 className="text-3xl font-bold mb-4">No Favorites Yet</h1>
        <p className="text-gray-400">Add movies or shows to favorites to see them here.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Your Favorites</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {favorites.map((item) => (
          <div key={item.id} className="bg-gray-900 rounded-lg overflow-hidden relative">
            {item.thumbnailUrl ? (
              <img
                src={item.thumbnailUrl}
                alt={item.title}
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="w-full h-48 bg-gray-700 flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
            <div className="p-2">
              <h3 className="font-bold text-lg">{item.title}</h3>
              <p className="text-gray-400 text-sm">
                {item.genre} • {item.type}
              </p>
              <p className="text-gray-400 text-sm">Rating: {item.rating}</p>
            </div>
            <button
              onClick={() => removeFromFavorites(item.id)}
              className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white px-2 py-1 text-xs rounded transition"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
