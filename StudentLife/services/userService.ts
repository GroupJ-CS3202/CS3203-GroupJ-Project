// src/services/userService.ts

export interface StoredUser {
  id: number | string;
  name?: string;
  email: string;
}

const USER_KEY = 'authUser';//refers to the name of the variable within the local storage

export function getStoredUser(): StoredUser | null {
  if (typeof window === 'undefined' || !window.localStorage) {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(USER_KEY);
    if (!raw) return null;

    const user = JSON.parse(raw) as StoredUser;
    if (!user || !user.email) return null;

    return user;
  } catch {
    return null;
  }
}


export function getStoredUserName(): string | null {
  const user = getStoredUser();
  if (!user) return null;

  return user.name || user.email || null;
}
