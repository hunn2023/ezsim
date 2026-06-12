const TOKEN_KEY = "ezsim_token";
const REFRESH_TOKEN_KEY = "ezsim_refresh_token";

const isClient = () => typeof window !== "undefined";

function safeGet(key: string): string | null {
  try {
    return isClient() ? localStorage.getItem(key) : null;
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string): void {
  try {
    if (isClient()) localStorage.setItem(key, value);
  } catch {
    // quota exceeded or access blocked — fail silently
  }
}

function safeRemove(key: string): void {
  try {
    if (isClient()) localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

export const authStorage = {
  getToken(): string | null {
    return safeGet(TOKEN_KEY);
  },
  setToken(token: string): void {
    safeSet(TOKEN_KEY, token);
  },
  getRefreshToken(): string | null {
    return safeGet(REFRESH_TOKEN_KEY);
  },
  setRefreshToken(token: string): void {
    safeSet(REFRESH_TOKEN_KEY, token);
  },
  clearAll(): void {
    safeRemove(TOKEN_KEY);
    safeRemove(REFRESH_TOKEN_KEY);
  },
  clearToken(): void {
    safeRemove(TOKEN_KEY);
  },
};
