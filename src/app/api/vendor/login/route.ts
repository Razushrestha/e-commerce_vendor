const LOGIN_API =
  process.env.NEXT_PUBLIC_LOGIN_API ??
  "http://36.253.137.34:8010/api/auth/sso/login/";

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const upstream = await fetch(LOGIN_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });

    const responseText = await upstream.text();
    return new Response(responseText, {
      status: upstream.status,
      headers: { "Content-Type": upstream.headers.get("Content-Type") ?? "application/json" },
    });
  } catch (error) {
    return Response.json(
      {
        detail: "Unable to reach login service.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 502 },
    );
  }
}
