import { NextRequest, NextResponse } from "next/server";
import { NEST_API_URL } from "../../message/route";

export async function GET(
  _: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const response = await fetch(`${NEST_API_URL}/chat/user/${params.userId}`);
    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
