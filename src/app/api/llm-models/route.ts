import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const skip = searchParams.get("skip") || "0";
  const limit = searchParams.get("limit") || "100";

  try {
    const response = await fetch(
      `http://192.168.1.9:8001/api/v1/llm-models/?skip=${skip}&limit=${limit}`,
      {
        headers: {
          accept: "application/json",
        },
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch LLM models" },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching LLM models:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
