import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "0";
    const size = searchParams.get("size") || "10";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const direction = searchParams.get("direction") || "desc";

    const authHeader = request.headers.get("Authorization");
    const headers: HeadersInit = {
      Accept: "application/json",
    };
    if (authHeader) {
      headers.Authorization = authHeader;
    }

    const response = await fetch(
      `${API_BASE_URL}/stories?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`,
      {
        headers,
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
    const { title, description, content, tags } = body;

    if (!title || !description || !content) {
      return NextResponse.json(
        { error: "Title, description, and content are required" },
        { status: 400 }
      );
    }

    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const response = await fetch(`${API_BASE_URL}/stories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify({ title, description, content, tags }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error("Backend error:", errorData);
      throw new Error(
        errorData?.message || `Failed to create story: ${response.status}`
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error creating story:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to create story",
      },
      { status: 500 }
    );
  }
}
