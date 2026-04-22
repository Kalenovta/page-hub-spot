import { useState, useCallback } from "react";
import { ProfileData, LinkItem } from "@/lib/types";
import { updateUserProfile } from "@/lib/auth";
import { useAuth } from "@/contexts/AuthContext";

export function useUserProfile() {
  const { currentUser, refreshUser } = useAuth();
  const [profile, setProfile] = useState<ProfileData>(() => currentUser?.profile ?? {
    name: "", bio: "", avatar: "", slug: "", links: [],
  });

  const save = useCallback((updated: ProfileData) => {
    if (!currentUser) return;
    updateUserProfile(currentUser.id, updated);
    refreshUser();
  }, [currentUser, refreshUser]);

  const updateProfile = (updates: Partial<ProfileData>) => {
    setProfile((prev) => {
      const next = { ...prev, ...updates };
      save(next);
      return next;
    });
  };

  const addLink = () => {
    const newLink: LinkItem = {
      id: Date.now().toString(),
      title: "New Link",
      url: "https://",
      icon: "Link",
      enabled: true,
    };
    setProfile((prev) => {
      const next = { ...prev, links: [...prev.links, newLink] };
      save(next);
      return next;
    });
  };

  const updateLink = (id: string, updates: Partial<LinkItem>) => {
    setProfile((prev) => {
      const next = {
        ...prev,
        links: prev.links.map((l) => (l.id === id ? { ...l, ...updates } : l)),
      };
      save(next);
      return next;
    });
  };

  const removeLink = (id: string) => {
    setProfile((prev) => {
      const next = { ...prev, links: prev.links.filter((l) => l.id !== id) };
      save(next);
      return next;
    });
  };

  const reorderLinks = (fromIndex: number, toIndex: number) => {
    setProfile((prev) => {
      const links = [...prev.links];
      const [moved] = links.splice(fromIndex, 1);
      links.splice(toIndex, 0, moved);
      const next = { ...prev, links };
      save(next);
      return next;
    });
  };

  return { profile, updateProfile, addLink, updateLink, removeLink, reorderLinks };
}
