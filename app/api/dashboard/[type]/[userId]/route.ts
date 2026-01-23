import { env } from "@/env";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { type: string; userId: string } },
) {
  const { type, userId } = params;

  // validación simple
  if (!["stats", "bots", "token-usage"].includes(type)) {
    return NextResponse.json(
      { error: "Invalid dashboard type" },
      { status: 400 },
    );
  }

  try {
    const res = await fetch(`${env.NEST_API_URL}/dashboard/${type}/${userId}`, {
      headers: {
        Cookie: req.headers.get("cookie") ?? "",
        "Content-Type": "application/json",
      },
      credentials: "include",
      cache: "no-store",
    });

    const data = await res.json();

    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return NextResponse.json({ error: "Backend unavailable" }, { status: 500 });
  }
}
