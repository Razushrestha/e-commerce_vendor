import { LoginPayload, ProductPayload } from "@/types/api";

const LOGIN_API = "/api/vendor/login";
const PRODUCT_API = "/api/vendor/products";
const CATEGORIES_API = "/api/vendor/categories";
const ORDERS_API = "/api/vendor/orders";

async function parseResponse(response: Response) {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { message: text || "Unknown response" };
  }
}

function getErrorMessage(payload: Record<string, unknown>) {
  const detail = payload.detail;
  if (typeof detail === "string") return detail;
  const message = payload.message;
  if (typeof message === "string") return message;
  const fieldMessages: string[] = [];
  const collect = (value: unknown, path = "") => {
    if (value === null || value === undefined) return;
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      fieldMessages.push(path ? `${path}: ${String(value)}` : String(value));
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((item, idx) => collect(item, path ? `${path}[${idx}]` : `[${idx}]`));
      return;
    }
    if (typeof value === "object") {
      Object.entries(value as Record<string, unknown>).forEach(([k, v]) => {
        collect(v, path ? `${path}.${k}` : k);
      });
    }
  };
  collect(payload.upstream_error, "backend");
  collect(payload, "");
  if (fieldMessages.length) return fieldMessages.join(" | ");
  return "Request failed. Please verify all fields.";
}

export function extractToken(payload: Record<string, unknown>) {
  const candidates = [
    payload.access,
    payload.access_token,
    payload.token,
    payload.jwt,
    payload.auth_token,
    (payload.data as Record<string, unknown> | undefined)?.access,
    (payload.data as Record<string, unknown> | undefined)?.token,
  ];
  return candidates.find((token) => typeof token === "string") as
    | string
    | undefined;
}

export async function loginVendor(payload: LoginPayload) {
  const response = await fetch(LOGIN_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(getErrorMessage(data));
  }

  return data;
}

export async function fetchProducts(token: string) {
  const response = await fetch(PRODUCT_API, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  const data = await parseResponse(response);
  if (!response.ok) {
    throw new Error(getErrorMessage(data));
  }
  return Array.isArray(data) ? data : (data.results as unknown[]) ?? [];
}

export async function fetchCategories(token: string) {
  const response = await fetch(CATEGORIES_API, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  const data = await parseResponse(response);
  if (!response.ok) {
    throw new Error(getErrorMessage(data));
  }
  return Array.isArray(data) ? data : (data.results as unknown[]) ?? [];
}

export async function addProduct(token: string, payload: ProductPayload) {
  const formData = new FormData();

  // Match backend serializer fields exactly.
  const allowedFields: Array<keyof ProductPayload> = [
    "name",
    "description",
    "price",
    "stock",
    "is_active",
    "category",
  ];
  allowedFields.forEach((key) => {
    const value = payload[key];
    if (value === undefined || value === null) return;
    if (typeof value === "string" && value.trim() === "") return;
    if (key === "price") {
      formData.append("price", Number(value).toFixed(2));
      return;
    }
    formData.append(String(key), String(value));
  });
  if (payload.image instanceof File) {
    formData.append("image", payload.image);
  }

  const response = await fetch(PRODUCT_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(getErrorMessage(data));
  }

  return data;
}

export async function fetchVendorOrders(token: string) {
  const response = await fetch(ORDERS_API, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  const data = await parseResponse(response);
  if (!response.ok) {
    throw new Error(getErrorMessage(data));
  }

  if (Array.isArray(data)) return data;
  if (Array.isArray(data.results)) return data.results as unknown[];
  if (Array.isArray(data.orders)) return data.orders as unknown[];
  if (Array.isArray(data.data)) return data.data as unknown[];
  return [];
}
