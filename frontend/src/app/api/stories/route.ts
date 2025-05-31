import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "0";
    const size = searchParams.get("size") || "10";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const direction = searchParams.get("direction") || "desc";

    const response = await fetch(
      `${API_BASE_URL}/api/stories?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`,
      {
        headers: {
          Accept: "application/json",
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error("Backend error:", errorData);
      throw new Error(
        errorData?.message || `Failed to fetch stories: ${response.status}`
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching stories:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to fetch stories",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, authorId } = body;

    if (!title || !description || !authorId) {
      return NextResponse.json(
        { error: "Title, description, and authorId are required" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${API_BASE_URL}/api/stories?authorId=${authorId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to create story");
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error creating story:", error);
    return NextResponse.json(
      { error: "Failed to create story" },
      { status: 500 }
    );
  }
}
