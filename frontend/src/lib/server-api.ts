const API_URL = process.env.API_URL ?? "http://localhost:8080/api";

/**
 * Fetches public data for server components. Responses are cached and revalidated in the background, so readers
 * get a fast page even while the API is waking up. Returns null instead of throwing so pages can fall back to
 * loading on the client (which also covers drafts that need the reader's token).
 */
export async function fetchPublic<T>(path: string, revalidate = 60): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      headers: { Accept: "application/json" },
      next: { revalidate },
      signal: AbortSignal.timeout(20_000),
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}
