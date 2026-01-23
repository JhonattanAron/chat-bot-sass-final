import { NextRequest, NextResponse } from "next/server";
import { env } from "@/env";

export async function GET(req: NextRequest, { params }: any) {
  return proxy(req, params.path);
}

export async function POST(req: NextRequest, { params }: any) {
  return proxy(req, params.path);
}

export async function PUT(req: NextRequest, { params }: any) {
  return proxy(req, params.path);
}

export async function DELETE(req: NextRequest, { params }: any) {
  return proxy(req, params.path);
}

async function proxy(req: NextRequest, path: string[]) {
  const url = `${env.NEST_API_URL}/${path.join("/")}${req.nextUrl.search}`;

  const res = await fetch(url, {
    method: req.method,
    headers: {
      "Content-Type": "application/json",
      cookie: req.headers.get("cookie") ?? "",
      authorization: req.headers.get("authorization") ?? "",
    },
    body: req.method !== "GET" ? await req.text() : undefined,
  });

  const data = await res.text();

  return new NextResponse(data, {
    status: res.status,
    headers: res.headers,
  });
}
