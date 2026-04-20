"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  addProduct,
  extractToken,
  fetchCategories,
  fetchVendorOrders,
  fetchProducts,
  loginVendor,
} from "@/lib/api";
import { LoginPayload, ProductPayload } from "@/types/api";

type ProductRecord = ProductPayload & {
  id?: number | string;
  created_at?: string;
};

type CategoryRecord = {
  id: number;
  name?: string;
  title?: string;
};

type OrderRecord = {
  id?: number | string;
  order_id?: number | string;
  full_name?: string;
  address?: string;
  phone_number?: string;
  notes?: string;
  payment_type?: string;
  status?: string;
  total_amount?: number | string;
  shipping_charge?: number | string;
  amount?: number | string;
  payment_screenshot?: string | null;
  payment_confirmed_at?: string;
  created_at?: string;
  updated_at?: string;
  customer_name?: string;
  customer?: string;
  [key: string]: unknown;
};

type SidebarTab = "dashboard" | "add-products" | "orders" | "products";

const defaultProduct: ProductPayload = {
  name: "",
  description: "",
  price: 0,
  stock: 0,
  category: null,
  is_active: true,
};

export default function Home() {
  const [token, setToken] = useState("");
  const [credentials, setCredentials] = useState<LoginPayload>({
    email: "",
    password: "",
  });
  const [product, setProduct] = useState<ProductPayload>(defaultProduct);
  const [productImage, setProductImage] = useState<File | null>(null);
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [keyword, setKeyword] = useState("");
  const [orderKeyword, setOrderKeyword] = useState("");
  const [activeTab, setActiveTab] = useState<SidebarTab>("dashboard");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  const [busy, setBusy] = useState({ login: false, create: false, refresh: false });
  const [error, setError] = useState("");
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!token) return;
    refreshProducts(token);
    refreshCategories(token);
    refreshOrders(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function refreshProducts(currentToken = token) {
    if (!currentToken) return;
    setBusy((prev) => ({ ...prev, refresh: true }));
    setError("");
    try {
      const data = (await fetchProducts(currentToken)) as ProductRecord[];
      setProducts(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to fetch products.");
    } finally {
      setBusy((prev) => ({ ...prev, refresh: false }));
    }
  }

  async function refreshCategories(currentToken = token) {
    if (!currentToken) return;
    try {
      const data = (await fetchCategories(currentToken)) as CategoryRecord[];
      setCategories(data);
    } catch (e) {
      setError(
        e instanceof Error ? `Categories: ${e.message}` : "Unable to fetch categories.",
      );
    }
  }

  async function refreshOrders(currentToken = token) {
    if (!currentToken) return;
    setBusy((prev) => ({ ...prev, refresh: true }));
    try {
      const data = (await fetchVendorOrders(currentToken)) as OrderRecord[];
      setOrders(data);
    } catch (e) {
      setError(e instanceof Error ? `Orders: ${e.message}` : "Unable to fetch orders.");
    } finally {
      setBusy((prev) => ({ ...prev, refresh: false }));
    }
  }

  async function onLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy((prev) => ({ ...prev, login: true }));
    setError("");
    try {
      const response = await loginVendor(credentials);
      const extracted = extractToken(response);
      if (!extracted) {
        throw new Error("Token not found in login response.");
      }
      setToken(extracted);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Login failed.");
    } finally {
      setBusy((prev) => ({ ...prev, login: false }));
    }
  }

  async function onAddProduct(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!token) return;
    setBusy((prev) => ({ ...prev, create: true }));
    setError("");
    try {
      const payload = {
        ...product,
        price: Number(product.price),
        stock: Number(product.stock),
        category:
          product.category === null || product.category === undefined
            ? null
            : Number(product.category),
        image: productImage ?? undefined,
      };
      const created = (await addProduct(token, payload)) as ProductRecord;
      setProducts((prev) => [created, ...prev]);
      setProduct({ ...defaultProduct, category: product.category });
      setProductImage(null);
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Product creation failed.");
    } finally {
      setBusy((prev) => ({ ...prev, create: false }));
    }
  }

  const getOrderCustomerName = (order: OrderRecord) =>
    String(
      order.full_name ??
        order.customer_name ??
        order.customer_full_name ??
        (order.customer as Record<string, unknown> | undefined)?.name ??
        "-",
    );

  const getOrderLocation = (order: OrderRecord) =>
    String(
      order.address ??
        order.location ??
        order.shipping_address ??
        order.delivery_address ??
        (order.customer as Record<string, unknown> | undefined)?.location ??
        "-",
    );

  const getOrderContact = (order: OrderRecord) =>
    String(
      order.phone_number ??
        order.contact ??
        order.phone ??
        order.customer_phone ??
        order.customer_contact ??
        (order.customer as Record<string, unknown> | undefined)?.phone ??
        "-",
    );

  const getOrderProductNames = (order: OrderRecord) => {
    const candidates = [order.items, order.order_items, order.products];
    const list = candidates.find((entry) => Array.isArray(entry));
    if (!Array.isArray(list) || list.length === 0) return "-";

    const names = list
      .map((entry) => {
        if (typeof entry === "string") return entry;
        if (!entry || typeof entry !== "object") return "";
        const obj = entry as Record<string, unknown>;
        const name =
          obj.product_name ??
          obj.name ??
          (obj.product as Record<string, unknown> | undefined)?.name ??
          (obj.product_details as Record<string, unknown> | undefined)?.name;
        const qty = obj.quantity ?? obj.qty;
        if (!name) return "";
        if (typeof qty === "number") return `${String(name)} x${qty}`;
        return String(name);
      })
      .filter(Boolean);

    return names.length ? names.join(", ") : "-";
  };

  const getOrderProductRows = (order: OrderRecord) => {
    const candidates = [order.items, order.order_items, order.products];
    const list = candidates.find((entry) => Array.isArray(entry));
    if (!Array.isArray(list)) return [];

    return list
      .map((entry) => {
        if (!entry || typeof entry !== "object") return null;
        const obj = entry as Record<string, unknown>;
        const name =
          obj.product_name ??
          obj.name ??
          (obj.product as Record<string, unknown> | undefined)?.name ??
          (obj.product_details as Record<string, unknown> | undefined)?.name;
        const quantity = Number(obj.quantity ?? obj.qty ?? 1);
        const unitPrice = Number(
          obj.price ??
            obj.unit_price ??
            obj.selling_price ??
            obj.product_price ??
            (obj.product as Record<string, unknown> | undefined)?.price ??
            0,
        );
        if (!name) return null;
        return {
          name: String(name),
          quantity: Number.isNaN(quantity) ? 1 : quantity,
          price: Number.isNaN(unitPrice) ? 0 : unitPrice,
        };
      })
      .filter(Boolean) as Array<{ name: string; quantity: number; price: number }>;
  };

  const filteredProducts = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return products;
    return products.filter((item) =>
      `${item.name ?? ""} ${item.description ?? ""}`.toLowerCase().includes(q),
    );
  }, [products, keyword]);

  const filteredOrders = useMemo(() => {
    const q = orderKeyword.trim().toLowerCase();
    if (!q) return orders;
    return orders.filter((item) =>
      `${item.id ?? ""} ${item.order_id ?? ""} ${item.status ?? ""} ${getOrderCustomerName(item)} ${getOrderLocation(item)} ${getOrderContact(item)} ${item.notes ?? ""} ${item.payment_type ?? ""} ${getOrderProductNames(item)}`
        .toLowerCase()
        .includes(q),
    );
  }, [orders, orderKeyword]);

  const metrics = useMemo(() => {
    const total = products.length;
    const inventory = products.reduce((sum, item) => sum + Number(item.stock ?? 0), 0);
    const value = products.reduce(
      (sum, item) => sum + Number(item.price ?? 0) * Number(item.stock ?? 0),
      0,
    );
    return { total, inventory, value };
  }, [products]);

  const orderMetrics = useMemo(() => {
    const totalOrders = orders.length;
    const pending = orders.filter((o) => String(o.status ?? "").toLowerCase() === "pending").length;
    const completed = orders.filter((o) =>
      ["completed", "delivered"].includes(String(o.status ?? "").toLowerCase()),
    ).length;
    return { totalOrders, pending, completed };
  }, [orders]);

  const isAuthenticated = Boolean(token);

  return (
    <main className="gradient-surface min-h-screen px-4 py-8 text-slate-100 md:px-10">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        {error ? (
          <div className="glass rounded-xl border border-red-400/35 bg-red-500/15 p-3 text-sm text-red-100">
            {error}
          </div>
        ) : null}

        {!isAuthenticated ? (
          <section className="mx-auto w-full max-w-md">
            <form onSubmit={onLogin} className="glass rounded-2xl p-5">
              <h2 className="text-lg font-medium">Vendor Login</h2>
              <p className="mt-1 text-sm text-slate-300">
                Login first. Dashboard will open only after successful authentication.
              </p>
              <div className="mt-4 space-y-3">
                <input
                  placeholder="Email / Username / Phone"
                  value={credentials.email ?? credentials.username ?? ""}
                  onChange={(e) =>
                    setCredentials({ ...credentials, email: e.target.value, username: e.target.value })
                  }
                  className="w-full rounded-lg border bg-slate-900/60 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-400"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  className="w-full rounded-lg border bg-slate-900/60 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-400"
                />
                <button
                  type="submit"
                  disabled={busy.login}
                  className="w-full rounded-lg bg-cyan-500 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-60"
                >
                  {busy.login ? "Signing in..." : "Login"}
                </button>
              </div>
            </form>
          </section>
        ) : (
          <section className="relative">
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              className="glass mb-4 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-white/5"
            >
              <span className="text-xl leading-none">☰</span>
              Menu
            </button>

            {isDrawerOpen ? (
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="fixed inset-0 z-30 bg-black/45"
                aria-label="Close drawer backdrop"
              />
            ) : null}

            <aside
              className={`fixed left-4 top-6 z-40 w-[280px] rounded-2xl p-4 transition-transform duration-300 ${
                isDrawerOpen ? "translate-x-0" : "-translate-x-[125%]"
              } glass`}
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm text-emerald-300">Authenticated</p>
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="rounded-md border px-2 py-1 text-xs hover:bg-white/5"
                >
                  Close
                </button>
              </div>
              <nav className="space-y-2">
                {[
                  { id: "dashboard", label: "Dashboard" },
                  { id: "add-products", label: "Add Products" },
                  { id: "orders", label: "Orders" },
                  { id: "products", label: "Products" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(item.id as SidebarTab);
                      setIsDrawerOpen(false);
                    }}
                    className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                      activeTab === item.id
                        ? "bg-cyan-500 text-slate-950 font-semibold"
                        : "border hover:bg-white/5"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
              <button
                type="button"
                onClick={() => {
                  setToken("");
                  setProducts([]);
                  setOrders([]);
                  setIsDrawerOpen(false);
                }}
                className="mt-4 w-full rounded-lg border px-3 py-2 text-sm hover:bg-white/5"
              >
                Logout
              </button>
            </aside>

            <section className="space-y-6">
              {activeTab === "dashboard" ? (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  <MetricCard label="Products" value={metrics.total.toString()} />
                  <MetricCard label="Inventory Units" value={metrics.inventory.toString()} />
                  <MetricCard label="Inventory Value" value={`Rs ${metrics.value.toFixed(2)}`} />
                  <MetricCard label="Orders" value={orderMetrics.totalOrders.toString()} />
                  <MetricCard label="Pending Orders" value={orderMetrics.pending.toString()} />
                  <MetricCard label="Completed Orders" value={orderMetrics.completed.toString()} />
                </div>
              ) : null}

              {activeTab === "add-products" ? (
                <form onSubmit={onAddProduct} className="glass rounded-2xl p-5">
                  <h2 className="text-lg font-medium">Add Product</h2>
                  <div className="mt-4 space-y-3">
                    <Input
                      label="Name"
                      value={String(product.name ?? "")}
                      onChange={(value) => setProduct({ ...product, name: value })}
                    />
                    <Input
                      label="Description"
                      value={String(product.description ?? "")}
                      onChange={(value) => setProduct({ ...product, description: value })}
                    />
                    <Input
                      label="Price"
                      type="number"
                      value={String(product.price ?? 0)}
                      onChange={(value) => setProduct({ ...product, price: Number(value) })}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        label="Stock"
                        type="number"
                        value={String(product.stock ?? 0)}
                        onChange={(value) => setProduct({ ...product, stock: Number(value) })}
                      />
                      <label className="block">
                        <span className="mb-1 block text-xs text-slate-300">Category</span>
                        <select
                          value={String(product.category ?? "")}
                          onChange={(e) =>
                            setProduct({
                              ...product,
                              category: e.target.value === "" ? null : Number(e.target.value),
                            })
                          }
                          className="w-full rounded-lg border bg-slate-900/60 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-400"
                        >
                          <option value="">No category</option>
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name ?? cat.title ?? `Category ${cat.id}`}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                    <label className="block">
                      <span className="mb-1 block text-xs text-slate-300">Product Image</span>
                      <input
                        ref={imageInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => setProductImage(e.target.files?.[0] ?? null)}
                        className="w-full rounded-lg border bg-slate-900/60 px-3 py-2 text-sm outline-none file:mr-3 file:rounded-md file:border-0 file:bg-cyan-500 file:px-3 file:py-1 file:text-slate-950 file:font-semibold focus:ring-2 focus:ring-cyan-400"
                      />
                      {productImage ? (
                        <p className="mt-1 text-xs text-slate-400">{productImage.name}</p>
                      ) : null}
                    </label>
                    <button
                      type="submit"
                      disabled={busy.create}
                      className="w-full rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-60"
                    >
                      {busy.create ? "Adding..." : "Create Product"}
                    </button>
                  </div>
                </form>
              ) : null}

              {activeTab === "products" ? (
                <div className="glass rounded-2xl p-5">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <h2 className="text-lg font-medium">Products</h2>
                    <div className="flex gap-2">
                      <input
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="Search products..."
                        className="rounded-lg border bg-slate-900/60 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-400"
                      />
                      <button
                        type="button"
                        onClick={() => refreshProducts()}
                        disabled={busy.refresh}
                        className="rounded-lg border px-3 py-2 text-sm hover:bg-white/5 disabled:opacity-60"
                      >
                        {busy.refresh ? "Refreshing..." : "Refresh"}
                      </button>
                    </div>
                  </div>
                  <div className="max-h-[420px] overflow-auto rounded-lg border border-white/10">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-900/70 text-slate-300">
                        <tr>
                          <th className="px-3 py-2">Image</th>
                          <th className="px-3 py-2">Name</th>
                          <th className="px-3 py-2">Price</th>
                          <th className="px-3 py-2">Stock</th>
                          <th className="px-3 py-2">Category</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProducts.map((item, i) => (
                          <tr
                            key={String(item.id ?? `${item.name}-${i}`)}
                            className="border-t border-white/5"
                          >
                            <td className="px-3 py-2">
                              {item.image ? (
                                // Using plain img here to support dynamic external URLs from backend without domain allowlist setup.
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={String(item.image)}
                                  alt={String(item.name ?? "Product image")}
                                  className="h-12 w-12 rounded-md border border-white/10 object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                              ) : (
                                <span className="text-xs text-slate-400">No image</span>
                              )}
                            </td>
                            <td className="px-3 py-2">{String(item.name ?? "-")}</td>
                            <td className="px-3 py-2">Rs {Number(item.price ?? 0).toFixed(2)}</td>
                            <td className="px-3 py-2">{Number(item.stock ?? 0)}</td>
                            <td className="px-3 py-2">{String(item.category ?? "-")}</td>
                          </tr>
                        ))}
                        {!filteredProducts.length ? (
                          <tr>
                            <td colSpan={5} className="px-3 py-6 text-center text-slate-400">
                              No products to display.
                            </td>
                          </tr>
                        ) : null}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : null}

              {activeTab === "orders" ? (
                <div className="glass rounded-2xl p-5">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <h2 className="text-lg font-medium">Vendor Orders</h2>
                    <div className="flex gap-2">
                      <input
                        value={orderKeyword}
                        onChange={(e) => setOrderKeyword(e.target.value)}
                        placeholder="Search orders..."
                        className="rounded-lg border bg-slate-900/60 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-400"
                      />
                      <button
                        type="button"
                        onClick={() => refreshOrders()}
                        disabled={busy.refresh}
                        className="rounded-lg border px-3 py-2 text-sm hover:bg-white/5 disabled:opacity-60"
                      >
                        {busy.refresh ? "Refreshing..." : "Refresh Orders"}
                      </button>
                    </div>
                  </div>
                  <div className="max-h-[420px] overflow-auto rounded-lg border border-white/10">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-900/70 text-slate-300">
                        <tr>
                          <th className="px-3 py-2">Order ID</th>
                          <th className="px-3 py-2">Name</th>
                          <th className="px-3 py-2">Address</th>
                          <th className="px-3 py-2">Phone</th>
                          <th className="px-3 py-2">Products</th>
                          <th className="px-3 py-2">Notes</th>
                          <th className="px-3 py-2">Payment</th>
                          <th className="px-3 py-2">Amount</th>
                          <th className="px-3 py-2">Shipping</th>
                          <th className="px-3 py-2">Status</th>
                          <th className="px-3 py-2">Created</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOrders.map((item, i) => (
                          <tr
                            key={String(item.id ?? item.order_id ?? `order-${i}`)}
                            className="border-t border-white/5"
                          >
                            <td className="px-3 py-2">
                              <button
                                type="button"
                                onClick={() => setSelectedOrder(item)}
                                className="text-left text-cyan-300 hover:underline"
                              >
                                {String(item.order_id ?? item.id ?? "-")}
                              </button>
                            </td>
                            <td className="px-3 py-2">
                              <button
                                type="button"
                                onClick={() => setSelectedOrder(item)}
                                className="text-left hover:underline"
                              >
                                {getOrderCustomerName(item)}
                              </button>
                            </td>
                            <td className="px-3 py-2">{getOrderLocation(item)}</td>
                            <td className="px-3 py-2">{getOrderContact(item)}</td>
                            <td className="px-3 py-2 max-w-[280px] break-words">
                              {getOrderProductNames(item)}
                            </td>
                            <td className="px-3 py-2">{String(item.notes ?? "-")}</td>
                            <td className="px-3 py-2">{String(item.payment_type ?? "-")}</td>
                            <td className="px-3 py-2">
                              Rs {Number(item.total_amount ?? item.amount ?? 0).toFixed(2)}
                            </td>
                            <td className="px-3 py-2">
                              Rs {Number(item.shipping_charge ?? 0).toFixed(2)}
                            </td>
                            <td className="px-3 py-2">{String(item.status ?? "-")}</td>
                            <td className="px-3 py-2">
                              {item.created_at
                                ? new Date(String(item.created_at)).toLocaleString()
                                : "-"}
                            </td>
                          </tr>
                        ))}
                        {!filteredOrders.length ? (
                          <tr>
                            <td colSpan={11} className="px-3 py-6 text-center text-slate-400">
                              No orders to display.
                            </td>
                          </tr>
                        ) : null}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : null}
            </section>
          </section>
        )}
        {selectedOrder ? (
          <>
            <button
              type="button"
              onClick={() => setSelectedOrder(null)}
              className="fixed inset-0 z-40 bg-black/55"
              aria-label="Close order details backdrop"
            />
            <section className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="glass max-h-[90vh] w-full max-w-4xl overflow-auto rounded-2xl p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Order Details</h3>
                  <button
                    type="button"
                    onClick={() => setSelectedOrder(null)}
                    className="rounded-lg border px-3 py-1 text-sm hover:bg-white/5"
                  >
                    Close
                  </button>
                </div>

                <div className="grid gap-3 text-sm sm:grid-cols-2">
                  <DetailRow
                    label="Order ID"
                    value={String(selectedOrder.order_id ?? selectedOrder.id ?? "-")}
                  />
                  <DetailRow label="Name" value={getOrderCustomerName(selectedOrder)} />
                  <DetailRow label="Phone Number" value={getOrderContact(selectedOrder)} />
                  <DetailRow label="Address" value={getOrderLocation(selectedOrder)} />
                  <DetailRow label="Notes" value={String(selectedOrder.notes ?? "-")} />
                  <DetailRow label="Payment" value={String(selectedOrder.payment_type ?? "-")} />
                  <DetailRow
                    label="Status"
                    value={String(selectedOrder.status ?? "-")}
                  />
                  <DetailRow
                    label="Total Amount"
                    value={`Rs ${Number(
                      selectedOrder.total_amount ?? selectedOrder.amount ?? 0,
                    ).toFixed(2)}`}
                  />
                </div>

                <div className="mt-5">
                  <h4 className="mb-2 text-base font-medium">Products (Estimate Bill)</h4>
                  <div className="overflow-auto rounded-lg border border-white/10">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-900/70 text-slate-300">
                        <tr>
                          <th className="px-3 py-2">Product Name</th>
                          <th className="px-3 py-2">Quantity</th>
                          <th className="px-3 py-2">Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getOrderProductRows(selectedOrder).map((row, idx) => (
                          <tr key={`${row.name}-${idx}`} className="border-t border-white/5">
                            <td className="px-3 py-2">{row.name}</td>
                            <td className="px-3 py-2">{row.quantity}</td>
                            <td className="px-3 py-2">
                              Rs {(row.price * row.quantity).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                        {!getOrderProductRows(selectedOrder).length ? (
                          <tr>
                            <td colSpan={3} className="px-3 py-6 text-center text-slate-400">
                              No product line items available for this order.
                            </td>
                          </tr>
                        ) : null}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>
          </>
        ) : null}
      </section>
    </main>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="glass rounded-2xl p-4">
      <p className="text-xs uppercase tracking-widest text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-cyan-200">{value}</p>
    </article>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-slate-300">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border bg-slate-900/60 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-400"
      />
    </label>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-slate-900/40 p-2">
      <p className="text-xs uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-1 text-sm text-slate-100">{value}</p>
    </div>
  );
}
