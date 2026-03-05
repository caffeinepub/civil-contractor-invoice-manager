export type UserRole = "admin" | "user";
export interface UserAccount {
  username: string;
  password: string;
  role: UserRole;
}

const USERS_STORAGE_KEY = "cim_users";

const DEFAULT_USERS: UserAccount[] = [
  { username: "Mikeee", password: "kuchbhi@123", role: "admin" },
  { username: "User2", password: "user2@123", role: "user" },
  { username: "User3", password: "user3@123", role: "user" },
];

function loadUsers(): UserAccount[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (raw) return JSON.parse(raw) as UserAccount[];
  } catch {}
  // Seed defaults on first load
  saveUsers(DEFAULT_USERS);
  return DEFAULT_USERS;
}

function saveUsers(users: UserAccount[]): void {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

export function getUsers(): UserAccount[] {
  return loadUsers();
}

export function addUser(
  username: string,
  password: string,
): { ok: boolean; error?: string } {
  const users = loadUsers();
  if (users.find((u) => u.username.toLowerCase() === username.toLowerCase())) {
    return { ok: false, error: "Username already exists" };
  }
  users.push({
    username: username.trim(),
    password: password.trim(),
    role: "user",
  });
  saveUsers(users);
  return { ok: true };
}

export function updateUser(
  originalUsername: string,
  newUsername: string,
  newPassword: string,
): { ok: boolean; error?: string } {
  const users = loadUsers();
  const idx = users.findIndex((u) => u.username === originalUsername);
  if (idx === -1) return { ok: false, error: "User not found" };
  if (users[idx].role === "admin")
    return { ok: false, error: "Cannot edit admin account" };
  // Check duplicate username (excluding self)
  const duplicate = users.find(
    (u, i) =>
      i !== idx && u.username.toLowerCase() === newUsername.toLowerCase(),
  );
  if (duplicate) return { ok: false, error: "Username already exists" };
  users[idx] = {
    ...users[idx],
    username: newUsername.trim(),
    password: newPassword.trim(),
  };
  saveUsers(users);
  return { ok: true };
}

export function deleteUser(username: string): { ok: boolean; error?: string } {
  const users = loadUsers();
  const idx = users.findIndex((u) => u.username === username);
  if (idx === -1) return { ok: false, error: "User not found" };
  if (users[idx].role === "admin")
    return { ok: false, error: "Cannot delete admin account" };
  users.splice(idx, 1);
  saveUsers(users);
  return { ok: true };
}

// localStorage keys
const KEY_AUTH = "cim_auth";
const KEY_USER = "cim_user";
const KEY_ROLE = "cim_role";

export function login(username: string, password: string): UserAccount | null {
  const users = loadUsers();
  const found = users.find(
    (u) => u.username === username && u.password === password,
  );
  if (found) {
    localStorage.setItem(KEY_AUTH, "true");
    localStorage.setItem(KEY_USER, found.username);
    localStorage.setItem(KEY_ROLE, found.role);
  }
  return found ?? null;
}

export function logout(): void {
  localStorage.removeItem(KEY_AUTH);
  localStorage.removeItem(KEY_USER);
  localStorage.removeItem(KEY_ROLE);
}

export function getCurrentUser(): string {
  return localStorage.getItem(KEY_USER) ?? "";
}

export function getCurrentRole(): UserRole {
  return (localStorage.getItem(KEY_ROLE) as UserRole) ?? "user";
}

export function isAdmin(): boolean {
  return getCurrentRole() === "admin";
}

// Per-user owned IDs (for non-admin users)
export function getOwnedClientIds(): string[] {
  const user = getCurrentUser();
  if (!user) return [];
  try {
    return JSON.parse(
      localStorage.getItem(`cim_owned_clients_${user}`) ?? "[]",
    ) as string[];
  } catch {
    return [];
  }
}

export function addOwnedClientId(id: string): void {
  const user = getCurrentUser();
  if (!user || isAdmin()) return;
  const ids = getOwnedClientIds();
  if (!ids.includes(id)) {
    ids.push(id);
    localStorage.setItem(`cim_owned_clients_${user}`, JSON.stringify(ids));
  }
}

export function getOwnedInvoiceIds(): string[] {
  const user = getCurrentUser();
  if (!user) return [];
  try {
    return JSON.parse(
      localStorage.getItem(`cim_owned_invoices_${user}`) ?? "[]",
    ) as string[];
  } catch {
    return [];
  }
}

export function addOwnedInvoiceId(id: string): void {
  const user = getCurrentUser();
  if (!user || isAdmin()) return;
  const ids = getOwnedInvoiceIds();
  if (!ids.includes(id)) {
    ids.push(id);
    localStorage.setItem(`cim_owned_invoices_${user}`, JSON.stringify(ids));
  }
}
