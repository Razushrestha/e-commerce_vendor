const VENDOR_ORDERS_API =
  "http://36.253.137.34:8004/api/orders/vendor_orders/";

function getAuthHeader(request: Request) {
  const auth = request.headers.get("authorization");
  return auth ?? "";
}

export async function GET(request: Request) {
  try {
    const upstream = await fetch(VENDOR_ORDERS_API, {
      method: "GET",
      headers: {
        Authorization: getAuthHeader(request),
      },
    });

    const responseText = await upstream.text();
    return new Response(responseText, {
      status: upstream.status,
      headers: {
        "Content-Type": upstream.headers.get("Content-Type") ?? "application/json",
      },
    });
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
