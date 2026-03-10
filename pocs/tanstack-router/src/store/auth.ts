export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  avatar: string;
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
}

let _state: AuthState = {
  user: null,
  token: null,
};

export async function login(
  email: string,
  password: string,
): Promise<AuthUser> {
  await delay(800);

  if (password !== "admin123") {
    throw new Error("Invalid credentials");
  }

  const users: Record<string, AuthUser> = {
    "admin@poc.dev": {
      id: "1",
      name: "Ada Lovelace",
      email: "admin@poc.dev",
      role: "admin",
      avatar: "AL",
    },
    "editor@poc.dev": {
      id: "2",
      name: "Grace Hopper",
      email: "editor@poc.dev",
      role: "editor",
      avatar: "GH",
    },
    "viewer@poc.dev": {
      id: "3",
      name: "Margaret Hamilton",
      email: "viewer@poc.dev",
      role: "viewer",
      avatar: "MH",
    },
  };

  const user = users[email];
  if (!user) throw new Error("User not found");

  _state = {
    user,
    token: `mock-jwt-${user.id}-${Date.now()}`,
  };

  sessionStorage.setItem("auth", JSON.stringify(_state));
  return user;
}

export function logout(): void {
  _state = { user: null, token: null };
  sessionStorage.removeItem("auth");
}

export function getAuth(): AuthState {
  if (!_state.user) {
    const stored = sessionStorage.getItem("auth");
    if (stored) {
      try {
        _state = JSON.parse(stored) as AuthState;
      } catch {
        sessionStorage.removeItem("auth");
      }
    }
  }
  return _state;
}

export function isAuthenticated(): boolean {
  return getAuth().user !== null;
}

export function hasRole(role: AuthUser["role"]): boolean {
  const roleHierarchy: Record<AuthUser["role"], number> = {
    admin: 3,
    editor: 2,
    viewer: 1,
  };
  const user = getAuth().user;
  if (!user) return false;
  return roleHierarchy[user.role] >= roleHierarchy[role];
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
