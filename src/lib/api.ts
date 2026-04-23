import { LoginPayload, ProductPayload } from "@/types/api";

const LOGIN_API = "/api/vendor/login";
const PRODUCT_API = "/api/vendor/products";
const CATEGORIES_API = "/api/vendor/categories";
const ORDERS_API = "/api/vendor/orders";

function getAuthHeaders(token?: string): HeadersInit {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function parseResponse(response: Response) {
  const text = await response.text();
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    try {
      return text ? JSON.parse(text) : {};
    } catch {
      return { message: text || "Unable to parse response JSON." };
    }
  }

  return { message: text || "No response body returned." };
}

function getErrorMessage(payload: Record<string, unknown> | unknown) {
  if (!payload || typeof payload !== "object") {
    return String(payload ?? "Request failed. Please verify all fields.");
  }

  const detail = (payload as Record<string, unknown>).detail;
  if (typeof detail === "string") return detail;

  const message = (payload as Record<string, unknown>).message;
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

  collect((payload as Record<string, unknown>).upstream_error, "backend");
  collect(payload, "");

  return fieldMessages.length
    ? fieldMessages.join(" | ")
    : "Request failed. Please verify all fields.";
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

  return candidates.find((token) => typeof token === "string") as string | undefined;
}

export async function loginVendor(payload: LoginPayload) {
  if (!payload.password) {
    throw new Error("Password is required.");
  }

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
    headers: getAuthHeaders(token),
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
    headers: getAuthHeaders(token),
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(getErrorMessage(data));
  }

  return Array.isArray(data) ? data : (data.results as unknown[]) ?? [];
}

function getProductUrl(id: string | number) {
  return `${PRODUCT_API}${id}/`;
}

function buildProductFormData(payload: ProductPayload) {
  const formData = new FormData();
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

    if (value === undefined) return;
    if (value === null) {
      formData.append(String(key), "");
      return;
    }
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

  return formData;
}

export async function addProduct(token: string, payload: ProductPayload) {
  if (!payload.name?.trim()) {
    throw new Error("Product name is required.");
  }

  if (typeof payload.price !== "number" || Number.isNaN(payload.price)) {
    throw new Error("Product price must be a valid number.");
  }

  if (typeof payload.stock !== "number" || Number.isNaN(payload.stock)) {
    throw new Error("Product stock must be a valid number.");
  }

  const formData = buildProductFormData(payload);

  const response = await fetch(PRODUCT_API, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: formData,
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(getErrorMessage(data));
  }

  return data;
}

export async function updateProduct(token: string, id: string | number, payload: ProductPayload) {
  if (!id) {
    throw new Error("Product ID is required for update.");
  }

  if (!payload.name?.trim()) {
    throw new Error("Product name is required.");
  }

  if (typeof payload.price !== "number" || Number.isNaN(payload.price)) {
    throw new Error("Product price must be a valid number.");
  }

  if (typeof payload.stock !== "number" || Number.isNaN(payload.stock)) {
    throw new Error("Product stock must be a valid number.");
  }

  const formData = buildProductFormData(payload);

  const response = await fetch(getProductUrl(id), {
    method: "PATCH",
    headers: getAuthHeaders(token),
    body: formData,
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(getErrorMessage(data));
  }

  return data;
}

export async function deleteProduct(token: string, id: string | number) {
  if (!id) {
    throw new Error("Product ID is required for delete.");
  }

  const response = await fetch(getProductUrl(id), {
    method: "DELETE",
    headers: getAuthHeaders(token),
  });

  if (!response.ok) {
    const data = await parseResponse(response);
    throw new Error(getErrorMessage(data));
  }

  return true;
}

export async function fetchVendorOrders(token: string) {
  const response = await fetch(ORDERS_API, {
    method: "GET",
    headers: getAuthHeaders(token),
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
