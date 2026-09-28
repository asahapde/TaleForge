const TOKEN_KEY = "taleforge.token";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export const tokenStore = {
  get: () => (typeof window === "undefined" ? null : window.localStorage.getItem(TOKEN_KEY)),
  set: (token: string) => window.localStorage.setItem(TOKEN_KEY, token),
  clear: () => window.localStorage.removeItem(TOKEN_KEY),
};

type Listener = () => void;
const unauthorizedListeners = new Set<Listener>();

export function onUnauthorized(listener: Listener) {
  unauthorizedListeners.add(listener);
  return () => unauthorizedListeners.delete(listener);
}

/** Browser-side request through the /api rewrite, carrying the signed-in reader's token. */
export async function api<T>(path: string, init: { method?: string; body?: unknown } = {}): Promise<T> {
  const token = tokenStore.get();
  const headers: Record<string, string> = { Accept: "application/json" };
  if (init.body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(`/api${path}`, {
      method: init.method ?? "GET",
      headers,
      body: init.body === undefined ? undefined : JSON.stringify(init.body),
    });
  } catch {
    throw new ApiError(0, "Couldn't reach TaleForge. Check your connection and try again.");
  }

  if (res.status === 401 && token) {
    unauthorizedListeners.forEach((l) => l());
  }
  if (!res.ok) {
    let message = res.status >= 500 ? "The server is having a moment. Try again shortly." : "Request failed.";
    try {
      const data = await res.json();
      if (data?.message) message = data.message;
    } catch {
      // Non-JSON error bodies (e.g. a proxy timeout) keep the generic message.
    }
    throw new ApiError(res.status, message);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

/** Rebuilds cached public pages after a change. Failures are harmless; the cache expires on its own. */
export async function refreshPages(...paths: string[]) {
  await fetch("/revalidate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ paths: ["/", "/stories", ...paths] }),
  }).catch(() => {});
}

/** Only follow same-site redirect targets after signing in. */
export function safeNext(next: string | null) {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/desk";
}

export function errorMessage(err: unknown) {
  if (err instanceof ApiError) return err.message;
  return "Something went wrong. Please try again.";
}
