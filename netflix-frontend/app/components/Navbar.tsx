"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import Image from "next/image";
import API from "../services/api";
import { FiSearch, FiHeart, FiStar, FiUser, FiSettings } from "react-icons/fi";
import { SiAdminer } from "react-icons/si";
import { RiAdminFill } from "react-icons/ri";

interface Profile {
  id: string;
  name: string;
}

export default function Navbar() {
  const { token, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);
  const [role, setRole] = useState<string>("User");
  const [searchQuery, setSearchQuery] = useState("");

  // Scroll effect: darken navbar on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch user profiles and role
  useEffect(() => {
    const fetchProfiles = async () => {
      if (token) {
        try {
          const res = await API.get("/users/me");
          setRole(res.data.role || "User");

          const profileRes = await API.get("/profile");
          setProfiles(profileRes.data);
          if (!currentProfile && profileRes.data.length > 0) {
            setCurrentProfile(profileRes.data[0]);
          }
        } catch (err) {
          console.error(err);
        }
      }
    };
    fetchProfiles();
  }, [token]);

  const switchProfile = (profile: Profile) => {
    setCurrentProfile(profile);
    setMenuOpen(false);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?query=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-500 ${
        scrolled ? "bg-black/95 shadow-lg" : "bg-gray-900"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link
          href="/"
          className="text-red-600 font-extrabold text-2xl md:text-3xl tracking-wide hover:text-red-500 transition-colors"
        >
          MyNetflix
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 mx-6 items-center">
          <input
            type="text"
            placeholder="Search movies, shows..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 p-2 rounded-l bg-gray-800 border border-gray-700 text-white focus:outline-none"
          />
          <button
            type="submit"
            className="bg-red-600 p-2 rounded-r  text-white hover:bg-red-700 transition-colors flex items-center gap-1"
          >
            <FiSearch /> Search
          </button>
        </form>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 font-medium text-gray-200">
          {token ? (
            <div className="relative flex items-center gap-4">
              {/* Admin Panel */}
              {role === "Admin" && (
                <Link
                href="/admin"
                className="hover:text-gray-300 transition-colors flex items-center gap-1"
              >
                <RiAdminFill/> Admin
              </Link>
              )}

              {/* Watchlist */}
              <Link
                href="/watchlist"
                className="hover:text-gray-300 transition-colors flex items-center gap-1"
              >
                <FiStar /> Watchlist
              </Link>

              {/* Favorites */}
              <Link
                href="/favorites"
                className="hover:text-gray-300 transition-colors flex items-center gap-1"
              >
                <FiHeart /> Favorites
              </Link>
               <Link
              href="/admin"
              className=" text-white px-4 py-2 rounded transition-colors"
            >
              Admin
            </Link>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 focus:outline-none"
                >
                  {currentProfile ? (
                    <div className="relative w-9 h-9">
                      <Image
                        src="/avatar.jpg"
                        alt={currentProfile.name}
                        fill
                        className="rounded-full border border-gray-500 object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-9 h-9 bg-gray-700 rounded-full" />
                  )}
                  <span>{currentProfile?.name || "Profile"}</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${menuOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-black border border-gray-700 rounded shadow-lg flex flex-col">
                    {profiles.map((profile) => (
                      <button
                        key={profile.id}
                        onClick={() => switchProfile(profile)}
                        className="px-4 py-2 hover:bg-gray-800 text-left transition-colors"
                      >
                        {profile.name}
                      </button>
                    ))}
                    <div className="border-t border-gray-700" />
                    <button
                      onClick={logout}
                      className="px-4 py-2 text-left hover:bg-gray-800 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="focus:outline-none p-2"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-black text-white px-6 py-4 flex flex-col gap-3 border-t border-gray-700">
          {token ? (
            <>
              {role === "Admin" && (
                <Link
                  href="/admin"
                  className="bg-yellow-600 hover:bg-yellow-700 text-black px-3 py-1 rounded font-semibold flex items-center gap-1"
                >
                  <FiSettings /> Admin
                </Link>
              )}
              <Link href="/watchlist" className="hover:text-gray-300 flex items-center gap-1">
                <FiStar /> Watchlist
              </Link>
              <Link href="/favorites" className="hover:text-gray-300 flex items-center gap-1">
                <FiHeart /> Favorites
              </Link>
              {profiles.map((profile) => (
                <button
                  key={profile.id}
                  onClick={() => switchProfile(profile)}
                  className="hover:text-gray-300 text-left"
                >
                  {profile.name}
                </button>
              ))}
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
