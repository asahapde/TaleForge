import { NextResponse } from "next/server";

// In-memory storage for stories (replace with database in production)
let stories: any[] = [];

export async function GET() {
  try {
    // TODO: Connect to backend API
    // For now, we'll just return the in-memory stories
    return NextResponse.json(stories);
  } catch (error) {
    console.error("Error fetching stories:", error);
    return NextResponse.json(
      { error: "Failed to fetch stories" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description } = body;

    // TODO: Add validation
    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    // TODO: Connect to backend API
    // For now, we'll just store in memory
    const story = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      description,
      createdAt: new Date().toISOString(),
    };

    stories.push(story);

    return NextResponse.json(story, { status: 201 });
  } catch (error) {
    console.error("Error creating story:", error);
    return NextResponse.json(
      { error: "Failed to create story" },
      { status: 500 }
    );
  }
}
