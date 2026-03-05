export type UserRole = "admin" | "user";
export interface UserAccount {
  username: string;
  password: string;
  role: UserRole;
}

export const USERS: UserAccount[] = [
  { username: "Mikeee", password: "kuchbhi@123", role: "admin" },
  { username: "User2", password: "user2@123", role: "user" },
  { username: "User3", password: "user3@123", role: "user" },
];

// localStorage keys
const KEY_AUTH = "cim_auth";
const KEY_USER = "cim_user";
const KEY_ROLE = "cim_role";

export function login(username: string, password: string): UserAccount | null {
  const found = USERS.find(
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
