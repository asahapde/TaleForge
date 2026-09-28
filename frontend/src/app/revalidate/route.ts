import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

const ALLOWED = /^\/(stories(\/\d+(\/chapters\/\d+)?)?|writers\/[\w-]+)?$/;

/**
 * Public pages are cached; after a writer changes something, the browser asks for the affected pages to be
 * rebuilt so the change shows up straight away. Revalidating only costs a refetch, so this needs no auth.
 */
export async function POST(request: Request) {
  const { paths } = (await request.json().catch(() => ({}))) as { paths?: unknown };
  if (!Array.isArray(paths)) return NextResponse.json({ revalidated: 0 }, { status: 400 });
  const valid = paths.filter((p): p is string => typeof p === "string" && ALLOWED.test(p)).slice(0, 10);
  valid.forEach((p) => revalidatePath(p));
  return NextResponse.json({ revalidated: valid.length });
}
