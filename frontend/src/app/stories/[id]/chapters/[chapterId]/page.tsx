import { ChapterView } from "@/components/chapter-view";
import { ChapterLoader } from "@/components/client-loaders";
import { fetchPublic } from "@/lib/server-api";
import type { ChapterDetail } from "@/lib/types";
import type { Metadata } from "next";

export const revalidate = 60;

export function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ id: string; chapterId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { chapterId } = await params;
  const chapter = await fetchPublic<ChapterDetail>(`/chapters/${chapterId}`);
  return chapter ? { title: `${chapter.title} · ${chapter.storyTitle}` } : { title: "Chapter" };
}

export default async function ChapterPage({ params }: Props) {
  const { chapterId } = await params;
  const chapter = await fetchPublic<ChapterDetail>(`/chapters/${chapterId}`);
  if (!chapter) return <ChapterLoader chapterId={chapterId} />;
  return <ChapterView chapter={chapter} />;
}
