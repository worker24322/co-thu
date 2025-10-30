export interface AppUser {
  id: string;
  email?: string;
  name?: string;
  avatar?: string;
  [key: string]: any;
}

function generateAvatarUrl(seed: string): string {
  const safeSeed = encodeURIComponent(seed || String(Math.random()).slice(2));
  // Dicebear initials style with pastel background
  return `https://api.dicebear.com/7.x/initials/svg?seed=${safeSeed}&backgroundType=gradientLinear&fontFamily=Verdana&bold=true`;
}

export function ensureUserAvatar(user: AppUser | null): AppUser | null {
  if (!user) return null;
  if (!user.avatar || typeof user.avatar !== 'string' || user.avatar.trim() === '') {
    const seed = user.id || user.email || user.name || 'guest';
    user.avatar = generateAvatarUrl(seed);
  }
  return user;
}

export function getStoredUser(): AppUser | null {
  try {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed as AppUser;
  } catch {
    return null;
  }
}

export function getUserWithAvatar(): AppUser | null {
  const user = ensureUserAvatar(getStoredUser());
  if (user) {
    try { localStorage.setItem('user', JSON.stringify(user)); } catch {}
  }
  return user;
}

export function setStoredUser(user: AppUser | null) {
  if (!user) {
    try { localStorage.removeItem('user'); } catch {}
    return;
  }
  const withAvatar = ensureUserAvatar(user);
  try { localStorage.setItem('user', JSON.stringify(withAvatar)); } catch {}
}


