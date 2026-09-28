"use client";

import { api } from "@/lib/api";
import { useEffect } from "react";

/** Counts one read per page per browser session. */
export function ViewTracker({ path }: { path: string }) {
  useEffect(() => {
    const key = `taleforge.viewed:${path}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    api(path, { method: "POST" }).catch(() => sessionStorage.removeItem(key));
  }, [path]);
  return null;
}
