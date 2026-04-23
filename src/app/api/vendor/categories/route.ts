import { buildUpstreamHeaders, proxyResponse } from "../route-utils";

const CATEGORIES_API = "http://36.253.137.34:8004/api/categories/";

export async function GET(request: Request) {
  try {
    const upstream = await fetch(CATEGORIES_API, {
      method: "GET",
      headers: buildUpstreamHeaders(request),
    });

    return proxyResponse(upstream);
  } catch (error) {
    return Response.json(
      {
        detail: "Unable to fetch categories.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 502 },
    );
  }
}
