import { buildUpstreamHeaders, proxyResponse } from "../route-utils";

const LOGIN_API =
  process.env.NEXT_PUBLIC_LOGIN_API ??
  "http://36.253.137.34:8010/api/auth/sso/login/";

export async function POST(request: Request) {
  try {
    const upstream = await fetch(LOGIN_API, {
      method: "POST",
      headers: buildUpstreamHeaders(request),
      body: await request.arrayBuffer(),
    });

    return proxyResponse(upstream);
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
