"use client";
import { createContext, useState, ReactNode, useContext, useEffect } from "react";
import API from "../services/api";

interface Profile {
  id: string;
  name: string;
  avatarUrl?: string;
}

interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  profiles: Profile[];
  currentProfile: Profile | null;
  switchProfile: (profile: Profile) => void;
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  login: () => {},
  logout: () => {},
  profiles: [],
  currentProfile: null,
  switchProfile: () => {}
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);

  // Load token from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) setToken(savedToken);
  }, []);

  // Fetch user profiles when token changes
  useEffect(() => {
    const fetchProfiles = async () => {
      if (token) {
        try {
          const res = await API.get("/profile");
          setProfiles(res.data);
          if (!currentProfile && res.data.length > 0) {
            setCurrentProfile(res.data[0]);
          }
        } catch (err) {
          console.error(err);
        }
      } else {
        setProfiles([]);
        setCurrentProfile(null);
      }
    };
    fetchProfiles();
  }, [token]);

  const login = (t: string) => {
    setToken(t);
    localStorage.setItem("token", t);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
    setProfiles([]);
    setCurrentProfile(null);
  };

  const switchProfile = (profile: Profile) => {
    setCurrentProfile(profile);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, profiles, currentProfile, switchProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
