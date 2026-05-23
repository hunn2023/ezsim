import { getToken, useAuthStore } from "@/lib/authStore";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

export type FetchWithAuthOptions = RequestInit & {
  /** Skip auto-prefixing with API_BASE_URL — use for absolute URLs */
  absoluteUrl?: boolean;
};

export async function fetchWithAuth(
  path: string,
  options: FetchWithAuthOptions = {}
): Promise<Response> {
  const { absoluteUrl, ...fetchOptions } = options;

  const token = getToken();
  const headers = new Headers(fetchOptions.headers);
  if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const url = absoluteUrl ? path : `${API_BASE_URL}${path}`;
  const response = await fetch(url, { ...fetchOptions, headers });

  if (response.status === 401) {
    useAuthStore.getState().logout();
  }

  return response;
}
