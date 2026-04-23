import { buildUpstreamHeaders, proxyResponse } from "../route-utils";

const PRODUCT_API =
  process.env.NEXT_PUBLIC_PRODUCT_API ??
  "http://36.253.137.34:8004/api/products/";

export async function GET(request: Request) {
  try {
    const upstream = await fetch(PRODUCT_API, {
      method: "GET",
      headers: buildUpstreamHeaders(request),
    });

    return proxyResponse(upstream);
  } catch (error) {
    return Response.json(
      {
        detail: "Unable to reach product service.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 502 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const upstream = await fetch(PRODUCT_API, {
      method: "POST",
      headers: buildUpstreamHeaders(request),
      body: await request.arrayBuffer(),
    });

    return proxyResponse(upstream);
  } catch (error) {
    return Response.json(
      {
        detail: "Unable to submit product to backend.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 502 },
    );
  }
}
