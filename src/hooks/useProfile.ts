import { useState, useEffect } from "react";
import { ProfileData, DEFAULT_PROFILE } from "@/lib/types";

const STORAGE_KEY = "linktree-profile";

export function useProfile() {
  const [profile, setProfile] = useState<ProfileData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }, [profile]);

  const updateProfile = (updates: Partial<ProfileData>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  const addLink = () => {
    const newLink = {
      id: Date.now().toString(),
      title: "New Link",
      url: "https://",
      icon: "Link",
      enabled: true,
    };
    setProfile((prev) => ({ ...prev, links: [...prev.links, newLink] }));
  };

  const updateLink = (id: string, updates: Partial<ProfileData["links"][0]>) => {
    setProfile((prev) => ({
      ...prev,
      links: prev.links.map((l) => (l.id === id ? { ...l, ...updates } : l)),
    }));
  };

  const removeLink = (id: string) => {
    setProfile((prev) => ({
      ...prev,
      links: prev.links.filter((l) => l.id !== id),
    }));
  };

  const reorderLinks = (fromIndex: number, toIndex: number) => {
    setProfile((prev) => {
      const links = [...prev.links];
      const [moved] = links.splice(fromIndex, 1);
      links.splice(toIndex, 0, moved);
      return { ...prev, links };
    });
  };

  return { profile, updateProfile, addLink, updateLink, removeLink, reorderLinks };
}
