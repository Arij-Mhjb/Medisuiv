// Auth utilities — lightweight localStorage-based session management

export interface AuthUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'PATIENT' | 'DOCTOR';
  specialty?: string;
}

const AUTH_KEY = 'medisuiv_user';

export function saveUser(user: AuthUser): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  }
}

export function getUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(AUTH_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function clearUser(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_KEY);
  }
}

export function isAuthenticated(): boolean {
  return getUser() !== null;
}
