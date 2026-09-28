import { StoryLoader } from "@/components/client-loaders";
import { StoryView } from "@/components/story-view";
import { fetchPublic } from "@/lib/server-api";
import type { ChapterNode, StoryDetail } from "@/lib/types";
import type { Metadata } from "next";

export const revalidate = 60;

// Nothing is prebuilt; each story page is rendered on its first visit and then served from cache.
export function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const story = await fetchPublic<StoryDetail>(`/stories/${id}`);
  return story ? { title: story.title, description: story.description } : { title: "Story" };
}

export default async function StoryPage({ params }: Props) {
  const { id } = await params;
  const [story, tree] = await Promise.all([
    fetchPublic<StoryDetail>(`/stories/${id}`),
    fetchPublic<ChapterNode[]>(`/stories/${id}/tree`),
  ]);
  if (!story || !tree) return <StoryLoader id={id} />;
  return <StoryView story={story} tree={tree} />;
}
