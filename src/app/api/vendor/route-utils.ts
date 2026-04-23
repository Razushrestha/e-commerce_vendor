const HOP_BY_HOP_HEADERS = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailers",
  "transfer-encoding",
  "upgrade",
]);

export function getAuthHeader(request: Request) {
  return request.headers.get("authorization") ?? request.headers.get("Authorization") ?? "";
}

export function buildUpstreamHeaders(request: Request, extra?: Record<string, string>) {
  const headers = new Headers();

  request.headers.forEach((value, key) => {
    if (!HOP_BY_HOP_HEADERS.has(key.toLowerCase())) {
      headers.set(key, value);
    }
  });

  const auth = getAuthHeader(request);
  if (auth) {
    headers.set("Authorization", auth);
  }

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  if (extra) {
    Object.entries(extra).forEach(([key, value]) => {
      headers.set(key, value);
    });
  }

  return headers;
}

export function proxyResponse(upstream: Response) {
  const headers = new Headers();

  upstream.headers.forEach((value, key) => {
    if (!HOP_BY_HOP_HEADERS.has(key.toLowerCase())) {
      headers.set(key, value);
    }
  });

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return new Response(upstream.body, {
    status: upstream.status,
    headers,
  });
}
