import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authoptions";
import { env } from "@/env";

type RouteContext = {
  params: {
    path: string[];
  };
};

export async function GET(req: NextRequest, { params }: RouteContext) {
  return proxy(req, params.path);
}

export async function POST(req: NextRequest, { params }: RouteContext) {
  return proxy(req, params.path);
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  return proxy(req, params.path);
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  return proxy(req, params.path);
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  return proxy(req, params.path);
}

async function proxy(req: NextRequest, path: string[]) {
  const publicRoutes = [["web-configs", "validate"]]; // rutas públicas

  // Comprobar si la ruta actual está en la lista de rutas públicas
  const isPublic = publicRoutes.some(
    (route) =>
      route.length === path.length && route.every((seg, i) => seg === path[i]),
  );

  // Solo requerir sesión si no es pública
  if (!isPublic) {
    const session = await getServerSession(authOptions);
    if (!session?.binding_id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Pasar binding_id al backend
    req.headers.set("x-user-id", session.binding_id);
  }

  // Construir URL del backend
  const url = `${env.NEST_API_URL}/${path.join("/")}${req.nextUrl.search}`;

  const res = await fetch(url, {
    method: req.method,
    headers: {
      "Content-Type": "application/json",
      ...(isPublic ? {} : { "x-user-id": req.headers.get("x-user-id")! }),
    },
    body:
      req.method === "GET" || req.method === "HEAD"
        ? undefined
        : await req.text(),
  });

  const data = await res.text();

  return new NextResponse(data, {
    status: res.status,
    headers: res.headers,
  });
}
