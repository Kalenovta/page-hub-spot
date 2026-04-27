export interface LinkItem {
  id: string;
  title: string;
  url: string;
  icon?: string;
  enabled: boolean;
  animation?: "none" | "wobble" | "bounce" | "blink";
}

export interface SocialLink {
  id: string;
  url: string;
  icon: string;
  enabled: boolean;
}

export interface ProfileTheme {
  backgroundColor?: string;
  buttonColor?: string;
  buttonTextColor?: string;
}

export interface ProfileData {
  name: string;
  bio: string;
  avatar: string;
  links: LinkItem[];
  socialLinks: SocialLink[];
  slug: string;
  theme?: ProfileTheme;
}

export interface UserAccount {
  id: string;
  email: string;
  password: string; // stored as plaintext in localStorage (demo only)
  createdAt: string;
  profile: ProfileData;
}

export const DEFAULT_PROFILE: ProfileData = {
  name: "Your Name",
  bio: "Developer · Creator · Dreamer",
  avatar: "",
  slug: "yourname",
  links: [
    { id: "1", title: "Portfolio", url: "https://example.com", icon: "Globe", enabled: true },
    { id: "2", title: "GitHub", url: "https://github.com", icon: "Github", enabled: true },
    { id: "3", title: "Twitter / X", url: "https://x.com", icon: "Twitter", enabled: true },
    { id: "4", title: "LinkedIn", url: "https://linkedin.com", icon: "Linkedin", enabled: true },
  ],
  socialLinks: [],
};
