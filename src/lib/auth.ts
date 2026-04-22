import { UserAccount, ProfileData, DEFAULT_PROFILE } from "./types";

const USERS_KEY = "pagehub-users";
const SESSION_KEY = "pagehub-session";

export function getUsers(): UserAccount[] {
  const raw = localStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveUsers(users: UserAccount[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getSession(): string | null {
  return localStorage.getItem(SESSION_KEY);
}

function setSession(userId: string) {
  localStorage.setItem(SESSION_KEY, userId);
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function getCurrentUser(): UserAccount | null {
  const userId = getSession();
  if (!userId) return null;
  const users = getUsers();
  return users.find((u) => u.id === userId) || null;
}

export interface AuthResult {
  success: boolean;
  error?: string;
  user?: UserAccount;
}

export function register(
  email: string,
  password: string,
  name: string,
  slug: string
): AuthResult {
  const users = getUsers();

  if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return { success: false, error: "Email already registered" };
  }

  const slugLower = slug.toLowerCase().replace(/[^a-z0-9-_]/g, "");
  if (users.find((u) => u.profile.slug === slugLower)) {
    return { success: false, error: "Username/slug already taken" };
  }

  if (password.length < 6) {
    return { success: false, error: "Password must be at least 6 characters" };
  }

  const newUser: UserAccount = {
    id: Date.now().toString(),
    email,
    password,
    createdAt: new Date().toISOString(),
    profile: {
      ...DEFAULT_PROFILE,
      name,
      slug: slugLower,
      links: DEFAULT_PROFILE.links.map((l) => ({ ...l, id: Date.now().toString() + Math.random() })),
    },
  };

  saveUsers([...users, newUser]);
  setSession(newUser.id);
  return { success: true, user: newUser };
}

export function login(email: string, password: string): AuthResult {
  const users = getUsers();
  const user = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!user) {
    return { success: false, error: "Invalid email or password" };
  }

  setSession(user.id);
  return { success: true, user };
}

export function logout() {
  clearSession();
}

export function updateUserProfile(userId: string, profile: Partial<ProfileData>): UserAccount | null {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) return null;

  users[idx] = { ...users[idx], profile: { ...users[idx].profile, ...profile } };
  saveUsers(users);
  return users[idx];
}

export function getUserBySlug(slug: string): UserAccount | null {
  const users = getUsers();
  return users.find((u) => u.profile.slug === slug) || null;
}
