import { buildUpstreamHeaders, proxyResponse } from "../../route-utils";

const PRODUCT_API =
  process.env.NEXT_PUBLIC_PRODUCT_API ??
  "http://36.253.137.34:8004/api/products/";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const params = await context.params;
  try {
    const upstream = await fetch(`${PRODUCT_API}${params.id}/`, {
      method: "PATCH",
      headers: buildUpstreamHeaders(request),
      body: await request.arrayBuffer(),
    });

    return proxyResponse(upstream);
  } catch (error) {
    return Response.json(
      {
        detail: "Unable to update product.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 502 },
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const params = await context.params;
  try {
    const upstream = await fetch(`${PRODUCT_API}${params.id}/`, {
      method: "DELETE",
      headers: buildUpstreamHeaders(request),
    });

    return proxyResponse(upstream);
  } catch (error) {
    return Response.json(
      {
        detail: "Unable to delete product.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 502 },
    );
  }
}
