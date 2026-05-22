import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const secret = process.env.AUTH_CODE;
  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "AUTH_CODE not configured on server" },
      { status: 503 }
    );
  }

  let body: { code?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
  }

  const code = (body.code ?? "").trim();
  if (!code || code !== secret) {
    return NextResponse.json({ ok: false, error: "Invalid code" }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
