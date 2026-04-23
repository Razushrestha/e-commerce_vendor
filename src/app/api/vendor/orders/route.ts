import { buildUpstreamHeaders, proxyResponse } from "../route-utils";

const VENDOR_ORDERS_API =
  "http://36.253.137.34:8004/api/orders/vendor_orders/";

export async function GET(request: Request) {
  try {
    const upstream = await fetch(VENDOR_ORDERS_API, {
      method: "GET",
      headers: buildUpstreamHeaders(request),
    });

    return proxyResponse(upstream);
  } catch (error) {
    return Response.json(
      {
        detail: "Unable to fetch vendor orders.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 502 },
    );
  }
}
