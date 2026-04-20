(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/e-commerce_vendor/src/lib/api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addProduct",
    ()=>addProduct,
    "extractToken",
    ()=>extractToken,
    "fetchCategories",
    ()=>fetchCategories,
    "fetchProducts",
    ()=>fetchProducts,
    "fetchVendorOrders",
    ()=>fetchVendorOrders,
    "loginVendor",
    ()=>loginVendor
]);
const LOGIN_API = "/api/vendor/login";
const PRODUCT_API = "/api/vendor/products";
const CATEGORIES_API = "/api/vendor/categories";
const ORDERS_API = "/api/vendor/orders";
async function parseResponse(response) {
    const text = await response.text();
    try {
        return text ? JSON.parse(text) : {};
    } catch  {
        return {
            message: text || "Unknown response"
        };
    }
}
function getErrorMessage(payload) {
    const detail = payload.detail;
    if (typeof detail === "string") return detail;
    const message = payload.message;
    if (typeof message === "string") return message;
    const fieldMessages = [];
    const collect = (value, path = "")=>{
        if (value === null || value === undefined) return;
        if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
            fieldMessages.push(path ? `${path}: ${String(value)}` : String(value));
            return;
        }
        if (Array.isArray(value)) {
            value.forEach((item, idx)=>collect(item, path ? `${path}[${idx}]` : `[${idx}]`));
            return;
        }
        if (typeof value === "object") {
            Object.entries(value).forEach(([k, v])=>{
                collect(v, path ? `${path}.${k}` : k);
            });
        }
    };
    collect(payload.upstream_error, "backend");
    collect(payload, "");
    if (fieldMessages.length) return fieldMessages.join(" | ");
    return "Request failed. Please verify all fields.";
}
function extractToken(payload) {
    const candidates = [
        payload.access,
        payload.access_token,
        payload.token,
        payload.jwt,
        payload.auth_token,
        payload.data?.access,
        payload.data?.token
    ];
    return candidates.find((token)=>typeof token === "string");
}
async function loginVendor(payload) {
    const response = await fetch(LOGIN_API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });
    const data = await parseResponse(response);
    if (!response.ok) {
        throw new Error(getErrorMessage(data));
    }
    return data;
}
async function fetchProducts(token) {
    const response = await fetch(PRODUCT_API, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });
    const data = await parseResponse(response);
    if (!response.ok) {
        throw new Error(getErrorMessage(data));
    }
    return Array.isArray(data) ? data : data.results ?? [];
}
async function fetchCategories(token) {
    const response = await fetch(CATEGORIES_API, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });
    const data = await parseResponse(response);
    if (!response.ok) {
        throw new Error(getErrorMessage(data));
    }
    return Array.isArray(data) ? data : data.results ?? [];
}
async function addProduct(token, payload) {
    const formData = new FormData();
    // Match backend serializer fields exactly.
    const allowedFields = [
        "name",
        "description",
        "price",
        "stock",
        "is_active",
        "category"
    ];
    allowedFields.forEach((key)=>{
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
            Authorization: `Bearer ${token}`
        },
        body: formData
    });
    const data = await parseResponse(response);
    if (!response.ok) {
        throw new Error(getErrorMessage(data));
    }
    return data;
}
async function fetchVendorOrders(token) {
    const response = await fetch(ORDERS_API, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });
    const data = await parseResponse(response);
    if (!response.ok) {
        throw new Error(getErrorMessage(data));
    }
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.results)) return data.results;
    if (Array.isArray(data.orders)) return data.orders;
    if (Array.isArray(data.data)) return data.data;
    return [];
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/e-commerce_vendor/src/components/Sidebar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Sidebar",
    ()=>Sidebar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/e-commerce_vendor/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
function Sidebar({ activeTab, onTabChange, onLogout }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
        className: "glass w-[280px] rounded-2xl p-4 h-fit sticky top-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-3 flex items-center justify-between",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-sm text-emerald-300",
                    children: "Authenticated"
                }, void 0, false, {
                    fileName: "[project]/e-commerce_vendor/src/components/Sidebar.tsx",
                    lineNumber: 13,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/e-commerce_vendor/src/components/Sidebar.tsx",
                lineNumber: 12,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: "space-y-2",
                children: [
                    {
                        id: "dashboard",
                        label: "Dashboard"
                    },
                    {
                        id: "add-products",
                        label: "Add Products"
                    },
                    {
                        id: "orders",
                        label: "Orders"
                    },
                    {
                        id: "products",
                        label: "Products"
                    }
                ].map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>onTabChange(item.id),
                        className: `w-full rounded-lg px-3 py-2 text-left text-sm transition ${activeTab === item.id ? "bg-cyan-500 text-slate-950 font-semibold" : "border hover:bg-white/5"}`,
                        children: item.label
                    }, item.id, false, {
                        fileName: "[project]/e-commerce_vendor/src/components/Sidebar.tsx",
                        lineNumber: 22,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/e-commerce_vendor/src/components/Sidebar.tsx",
                lineNumber: 15,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: onLogout,
                className: "mt-4 w-full rounded-lg border px-3 py-2 text-sm hover:bg-white/5",
                children: "Logout"
            }, void 0, false, {
                fileName: "[project]/e-commerce_vendor/src/components/Sidebar.tsx",
                lineNumber: 36,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/e-commerce_vendor/src/components/Sidebar.tsx",
        lineNumber: 11,
        columnNumber: 5
    }, this);
}
_c = Sidebar;
var _c;
__turbopack_context__.k.register(_c, "Sidebar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/e-commerce_vendor/src/app/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/e-commerce_vendor/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/e-commerce_vendor/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/e-commerce_vendor/src/lib/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$src$2f$components$2f$Sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/e-commerce_vendor/src/components/Sidebar.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const defaultProduct = {
    name: "",
    description: "",
    price: 0,
    stock: 0,
    category: null,
    is_active: true
};
function Home() {
    _s();
    const [token, setToken] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [credentials, setCredentials] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        email: "",
        password: ""
    });
    const [product, setProduct] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(defaultProduct);
    const [productImage, setProductImage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [products, setProducts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [categories, setCategories] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [orders, setOrders] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [keyword, setKeyword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [orderKeyword, setOrderKeyword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("dashboard");
    const [selectedOrder, setSelectedOrder] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [busy, setBusy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        login: false,
        create: false,
        refresh: false
    });
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const imageInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Home.useEffect": ()=>{
            if (!token) return;
            refreshProducts(token);
            refreshCategories(token);
            refreshOrders(token);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["Home.useEffect"], [
        token
    ]);
    async function refreshProducts(currentToken = token) {
        if (!currentToken) return;
        setBusy((prev)=>({
                ...prev,
                refresh: true
            }));
        setError("");
        try {
            const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchProducts"])(currentToken);
            setProducts(data);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Unable to fetch products.");
        } finally{
            setBusy((prev)=>({
                    ...prev,
                    refresh: false
                }));
        }
    }
    async function refreshCategories(currentToken = token) {
        if (!currentToken) return;
        try {
            const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchCategories"])(currentToken);
            setCategories(data);
        } catch (e) {
            setError(e instanceof Error ? `Categories: ${e.message}` : "Unable to fetch categories.");
        }
    }
    async function refreshOrders(currentToken = token) {
        if (!currentToken) return;
        setBusy((prev)=>({
                ...prev,
                refresh: true
            }));
        try {
            const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchVendorOrders"])(currentToken);
            setOrders(data);
        } catch (e) {
            setError(e instanceof Error ? `Orders: ${e.message}` : "Unable to fetch orders.");
        } finally{
            setBusy((prev)=>({
                    ...prev,
                    refresh: false
                }));
        }
    }
    async function onLogin(e) {
        e.preventDefault();
        setBusy((prev)=>({
                ...prev,
                login: true
            }));
        setError("");
        try {
            const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["loginVendor"])(credentials);
            const extracted = (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["extractToken"])(response);
            if (!extracted) {
                throw new Error("Token not found in login response.");
            }
            setToken(extracted);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Login failed.");
        } finally{
            setBusy((prev)=>({
                    ...prev,
                    login: false
                }));
        }
    }
    async function onAddProduct(e) {
        e.preventDefault();
        if (!token) return;
        setBusy((prev)=>({
                ...prev,
                create: true
            }));
        setError("");
        try {
            const payload = {
                ...product,
                price: Number(product.price),
                stock: Number(product.stock),
                category: product.category === null || product.category === undefined ? null : Number(product.category),
                image: productImage ?? undefined
            };
            const created = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addProduct"])(token, payload);
            setProducts((prev)=>[
                    created,
                    ...prev
                ]);
            setProduct({
                ...defaultProduct,
                category: product.category
            });
            setProductImage(null);
            if (imageInputRef.current) {
                imageInputRef.current.value = "";
            }
        } catch (e) {
            setError(e instanceof Error ? e.message : "Product creation failed.");
        } finally{
            setBusy((prev)=>({
                    ...prev,
                    create: false
                }));
        }
    }
    const getOrderCustomerName = (order)=>String(order.full_name ?? order.customer_name ?? order.customer_full_name ?? order.customer?.name ?? "-");
    const getOrderLocation = (order)=>String(order.address ?? order.location ?? order.shipping_address ?? order.delivery_address ?? order.customer?.location ?? "-");
    const getOrderContact = (order)=>String(order.phone_number ?? order.contact ?? order.phone ?? order.customer_phone ?? order.customer_contact ?? order.customer?.phone ?? "-");
    const getOrderProductNames = (order)=>{
        const candidates = [
            order.items,
            order.order_items,
            order.products
        ];
        const list = candidates.find((entry)=>Array.isArray(entry));
        if (!Array.isArray(list) || list.length === 0) return "-";
        const names = list.map((entry)=>{
            if (typeof entry === "string") return entry;
            if (!entry || typeof entry !== "object") return "";
            const obj = entry;
            const name = obj.product_name ?? obj.name ?? obj.product?.name ?? obj.product_details?.name;
            const qty = obj.quantity ?? obj.qty;
            if (!name) return "";
            if (typeof qty === "number") return `${String(name)} x${qty}`;
            return String(name);
        }).filter(Boolean);
        return names.length ? names.join(", ") : "-";
    };
    const getOrderProductRows = (order)=>{
        const candidates = [
            order.items,
            order.order_items,
            order.products
        ];
        const list = candidates.find((entry)=>Array.isArray(entry));
        if (!Array.isArray(list)) return [];
        return list.map((entry)=>{
            if (!entry || typeof entry !== "object") return null;
            const obj = entry;
            const name = obj.product_name ?? obj.name ?? obj.product?.name ?? obj.product_details?.name;
            const quantity = Number(obj.quantity ?? obj.qty ?? 1);
            const unitPrice = Number(obj.price ?? obj.unit_price ?? obj.selling_price ?? obj.product_price ?? obj.product?.price ?? 0);
            if (!name) return null;
            return {
                name: String(name),
                quantity: Number.isNaN(quantity) ? 1 : quantity,
                price: Number.isNaN(unitPrice) ? 0 : unitPrice
            };
        }).filter(Boolean);
    };
    const filteredProducts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Home.useMemo[filteredProducts]": ()=>{
            const q = keyword.trim().toLowerCase();
            if (!q) return products;
            return products.filter({
                "Home.useMemo[filteredProducts]": (item)=>`${item.name ?? ""} ${item.description ?? ""}`.toLowerCase().includes(q)
            }["Home.useMemo[filteredProducts]"]);
        }
    }["Home.useMemo[filteredProducts]"], [
        products,
        keyword
    ]);
    const filteredOrders = (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Home.useMemo[filteredOrders]": ()=>{
            const q = orderKeyword.trim().toLowerCase();
            if (!q) return orders;
            return orders.filter({
                "Home.useMemo[filteredOrders]": (item)=>`${item.id ?? ""} ${item.order_id ?? ""} ${item.status ?? ""} ${getOrderCustomerName(item)} ${getOrderLocation(item)} ${getOrderContact(item)} ${item.notes ?? ""} ${item.payment_type ?? ""} ${getOrderProductNames(item)}`.toLowerCase().includes(q)
            }["Home.useMemo[filteredOrders]"]);
        }
    }["Home.useMemo[filteredOrders]"], [
        orders,
        orderKeyword
    ]);
    const metrics = (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Home.useMemo[metrics]": ()=>{
            const total = products.length;
            const inventory = products.reduce({
                "Home.useMemo[metrics].inventory": (sum, item)=>sum + Number(item.stock ?? 0)
            }["Home.useMemo[metrics].inventory"], 0);
            const value = products.reduce({
                "Home.useMemo[metrics].value": (sum, item)=>sum + Number(item.price ?? 0) * Number(item.stock ?? 0)
            }["Home.useMemo[metrics].value"], 0);
            return {
                total,
                inventory,
                value
            };
        }
    }["Home.useMemo[metrics]"], [
        products
    ]);
    const orderMetrics = (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Home.useMemo[orderMetrics]": ()=>{
            const totalOrders = orders.length;
            const pending = orders.filter({
                "Home.useMemo[orderMetrics]": (o)=>String(o.status ?? "").toLowerCase() === "pending"
            }["Home.useMemo[orderMetrics]"]).length;
            const completed = orders.filter({
                "Home.useMemo[orderMetrics]": (o)=>[
                        "completed",
                        "delivered"
                    ].includes(String(o.status ?? "").toLowerCase())
            }["Home.useMemo[orderMetrics]"]).length;
            return {
                totalOrders,
                pending,
                completed
            };
        }
    }["Home.useMemo[orderMetrics]"], [
        orders
    ]);
    const isAuthenticated = Boolean(token);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "gradient-surface min-h-screen px-4 py-8 text-slate-100 md:px-10",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
            className: "mx-auto flex w-full max-w-7xl flex-col gap-6",
            children: [
                error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "glass rounded-xl border border-red-400/35 bg-red-500/15 p-3 text-sm text-red-100",
                    children: error
                }, void 0, false, {
                    fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                    lineNumber: 303,
                    columnNumber: 11
                }, this) : null,
                !isAuthenticated ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    className: "mx-auto w-full max-w-md",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        onSubmit: onLogin,
                        className: "glass rounded-2xl p-5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-lg font-medium",
                                children: "Vendor Login"
                            }, void 0, false, {
                                fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                lineNumber: 311,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1 text-sm text-slate-300",
                                children: "Login first. Dashboard will open only after successful authentication."
                            }, void 0, false, {
                                fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                lineNumber: 312,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-4 space-y-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        placeholder: "Email / Username / Phone",
                                        value: credentials.email ?? credentials.username ?? "",
                                        onChange: (e)=>setCredentials({
                                                ...credentials,
                                                email: e.target.value,
                                                username: e.target.value
                                            }),
                                        className: "w-full rounded-lg border bg-slate-900/60 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-400"
                                    }, void 0, false, {
                                        fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                        lineNumber: 316,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "password",
                                        placeholder: "Password",
                                        value: credentials.password,
                                        onChange: (e)=>setCredentials({
                                                ...credentials,
                                                password: e.target.value
                                            }),
                                        className: "w-full rounded-lg border bg-slate-900/60 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-400"
                                    }, void 0, false, {
                                        fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                        lineNumber: 324,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "submit",
                                        disabled: busy.login,
                                        className: "w-full rounded-lg bg-cyan-500 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-60",
                                        children: busy.login ? "Signing in..." : "Login"
                                    }, void 0, false, {
                                        fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                        lineNumber: 331,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                lineNumber: 315,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                        lineNumber: 310,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                    lineNumber: 309,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    className: "flex gap-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$src$2f$components$2f$Sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Sidebar"], {
                            activeTab: activeTab,
                            onTabChange: setActiveTab,
                            onLogout: ()=>{
                                setToken("");
                                setProducts([]);
                                setOrders([]);
                            }
                        }, void 0, false, {
                            fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                            lineNumber: 343,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                            className: "flex-1 space-y-6",
                            children: [
                                activeTab === "dashboard" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MetricCard, {
                                            label: "Products",
                                            value: metrics.total.toString()
                                        }, void 0, false, {
                                            fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                            lineNumber: 356,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MetricCard, {
                                            label: "Inventory Units",
                                            value: metrics.inventory.toString()
                                        }, void 0, false, {
                                            fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                            lineNumber: 357,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MetricCard, {
                                            label: "Inventory Value",
                                            value: `Rs ${metrics.value.toFixed(2)}`
                                        }, void 0, false, {
                                            fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                            lineNumber: 358,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MetricCard, {
                                            label: "Orders",
                                            value: orderMetrics.totalOrders.toString()
                                        }, void 0, false, {
                                            fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                            lineNumber: 359,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MetricCard, {
                                            label: "Pending Orders",
                                            value: orderMetrics.pending.toString()
                                        }, void 0, false, {
                                            fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                            lineNumber: 360,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MetricCard, {
                                            label: "Completed Orders",
                                            value: orderMetrics.completed.toString()
                                        }, void 0, false, {
                                            fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                            lineNumber: 361,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                    lineNumber: 355,
                                    columnNumber: 17
                                }, this) : null,
                                activeTab === "add-products" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                    onSubmit: onAddProduct,
                                    className: "glass rounded-2xl p-5",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "text-lg font-medium",
                                            children: "Add Product"
                                        }, void 0, false, {
                                            fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                            lineNumber: 367,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-4 space-y-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Input, {
                                                    label: "Name",
                                                    value: String(product.name ?? ""),
                                                    onChange: (value)=>setProduct({
                                                            ...product,
                                                            name: value
                                                        })
                                                }, void 0, false, {
                                                    fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                    lineNumber: 369,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Input, {
                                                    label: "Description",
                                                    value: String(product.description ?? ""),
                                                    onChange: (value)=>setProduct({
                                                            ...product,
                                                            description: value
                                                        })
                                                }, void 0, false, {
                                                    fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                    lineNumber: 374,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Input, {
                                                    label: "Price",
                                                    type: "number",
                                                    value: String(product.price ?? 0),
                                                    onChange: (value)=>setProduct({
                                                            ...product,
                                                            price: Number(value)
                                                        })
                                                }, void 0, false, {
                                                    fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                    lineNumber: 379,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-2 gap-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Input, {
                                                            label: "Stock",
                                                            type: "number",
                                                            value: String(product.stock ?? 0),
                                                            onChange: (value)=>setProduct({
                                                                    ...product,
                                                                    stock: Number(value)
                                                                })
                                                        }, void 0, false, {
                                                            fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                            lineNumber: 386,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "block",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "mb-1 block text-xs text-slate-300",
                                                                    children: "Category"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                                    lineNumber: 393,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                    value: String(product.category ?? ""),
                                                                    onChange: (e)=>setProduct({
                                                                            ...product,
                                                                            category: e.target.value === "" ? null : Number(e.target.value)
                                                                        }),
                                                                    className: "w-full rounded-lg border bg-slate-900/60 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-400",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                            value: "",
                                                                            children: "No category"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                                            lineNumber: 404,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        categories.map((cat)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                value: cat.id,
                                                                                children: cat.name ?? cat.title ?? `Category ${cat.id}`
                                                                            }, cat.id, false, {
                                                                                fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                                                lineNumber: 406,
                                                                                columnNumber: 29
                                                                            }, this))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                                    lineNumber: 394,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                            lineNumber: 392,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                    lineNumber: 385,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "mb-1 block text-xs text-slate-300",
                                                            children: "Product Image"
                                                        }, void 0, false, {
                                                            fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                            lineNumber: 414,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            ref: imageInputRef,
                                                            type: "file",
                                                            accept: "image/*",
                                                            onChange: (e)=>setProductImage(e.target.files?.[0] ?? null),
                                                            className: "w-full rounded-lg border bg-slate-900/60 px-3 py-2 text-sm outline-none file:mr-3 file:rounded-md file:border-0 file:bg-cyan-500 file:px-3 file:py-1 file:text-slate-950 file:font-semibold focus:ring-2 focus:ring-cyan-400"
                                                        }, void 0, false, {
                                                            fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                            lineNumber: 415,
                                                            columnNumber: 23
                                                        }, this),
                                                        productImage ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "mt-1 text-xs text-slate-400",
                                                            children: productImage.name
                                                        }, void 0, false, {
                                                            fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                            lineNumber: 423,
                                                            columnNumber: 25
                                                        }, this) : null
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                    lineNumber: 413,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "submit",
                                                    disabled: busy.create,
                                                    className: "w-full rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-60",
                                                    children: busy.create ? "Adding..." : "Create Product"
                                                }, void 0, false, {
                                                    fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                    lineNumber: 426,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                            lineNumber: 368,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                    lineNumber: 366,
                                    columnNumber: 17
                                }, this) : null,
                                activeTab === "products" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "glass rounded-2xl p-5",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mb-3 flex flex-wrap items-center justify-between gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                    className: "text-lg font-medium",
                                                    children: "Products"
                                                }, void 0, false, {
                                                    fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                    lineNumber: 440,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            value: keyword,
                                                            onChange: (e)=>setKeyword(e.target.value),
                                                            placeholder: "Search products...",
                                                            className: "rounded-lg border bg-slate-900/60 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-400"
                                                        }, void 0, false, {
                                                            fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                            lineNumber: 442,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: ()=>refreshProducts(),
                                                            disabled: busy.refresh,
                                                            className: "rounded-lg border px-3 py-2 text-sm hover:bg-white/5 disabled:opacity-60",
                                                            children: busy.refresh ? "Refreshing..." : "Refresh"
                                                        }, void 0, false, {
                                                            fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                            lineNumber: 448,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                    lineNumber: 441,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                            lineNumber: 439,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "max-h-[420px] overflow-auto rounded-lg border border-white/10",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                                className: "w-full text-left text-sm",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                                        className: "bg-slate-900/70 text-slate-300",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    className: "px-3 py-2",
                                                                    children: "Image"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                                    lineNumber: 462,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    className: "px-3 py-2",
                                                                    children: "Name"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                                    lineNumber: 463,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    className: "px-3 py-2",
                                                                    children: "Price"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                                    lineNumber: 464,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    className: "px-3 py-2",
                                                                    children: "Stock"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                                    lineNumber: 465,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    className: "px-3 py-2",
                                                                    children: "Category"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                                    lineNumber: 466,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                            lineNumber: 461,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                        lineNumber: 460,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                                        children: [
                                                            filteredProducts.map((item, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                                    className: "border-t border-white/5",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                            className: "px-3 py-2",
                                                                            children: item.image ? // Using plain img here to support dynamic external URLs from backend without domain allowlist setup.
                                                                            // eslint-disable-next-line @next/next/no-img-element
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                                src: String(item.image),
                                                                                alt: String(item.name ?? "Product image"),
                                                                                className: "h-12 w-12 rounded-md border border-white/10 object-cover",
                                                                                onError: (e)=>{
                                                                                    e.currentTarget.style.display = "none";
                                                                                }
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                                                lineNumber: 479,
                                                                                columnNumber: 33
                                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-xs text-slate-400",
                                                                                children: "No image"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                                                lineNumber: 488,
                                                                                columnNumber: 33
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                                            lineNumber: 475,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                            className: "px-3 py-2",
                                                                            children: String(item.name ?? "-")
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                                            lineNumber: 491,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                            className: "px-3 py-2",
                                                                            children: [
                                                                                "Rs ",
                                                                                Number(item.price ?? 0).toFixed(2)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                                            lineNumber: 492,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                            className: "px-3 py-2",
                                                                            children: Number(item.stock ?? 0)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                                            lineNumber: 493,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                            className: "px-3 py-2",
                                                                            children: String(item.category ?? "-")
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                                            lineNumber: 494,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, String(item.id ?? `${item.name}-${i}`), true, {
                                                                    fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                                    lineNumber: 471,
                                                                    columnNumber: 27
                                                                }, this)),
                                                            !filteredProducts.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    colSpan: 5,
                                                                    className: "px-3 py-6 text-center text-slate-400",
                                                                    children: "No products to display."
                                                                }, void 0, false, {
                                                                    fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                                    lineNumber: 499,
                                                                    columnNumber: 29
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                                lineNumber: 498,
                                                                columnNumber: 27
                                                            }, this) : null
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                        lineNumber: 469,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                lineNumber: 459,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                            lineNumber: 458,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                    lineNumber: 438,
                                    columnNumber: 17
                                }, this) : null,
                                activeTab === "orders" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "glass rounded-2xl p-5",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mb-3 flex flex-wrap items-center justify-between gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                    className: "text-lg font-medium",
                                                    children: "Vendor Orders"
                                                }, void 0, false, {
                                                    fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                    lineNumber: 513,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            value: orderKeyword,
                                                            onChange: (e)=>setOrderKeyword(e.target.value),
                                                            placeholder: "Search orders...",
                                                            className: "rounded-lg border bg-slate-900/60 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-400"
                                                        }, void 0, false, {
                                                            fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                            lineNumber: 515,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: ()=>refreshOrders(),
                                                            disabled: busy.refresh,
                                                            className: "rounded-lg border px-3 py-2 text-sm hover:bg-white/5 disabled:opacity-60",
                                                            children: busy.refresh ? "Refreshing..." : "Refresh Orders"
                                                        }, void 0, false, {
                                                            fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                            lineNumber: 521,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                    lineNumber: 514,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                            lineNumber: 512,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "max-h-[420px] overflow-auto rounded-lg border border-white/10",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                                className: "w-full text-left text-sm",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                                        className: "bg-slate-900/70 text-slate-300",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    className: "px-3 py-2",
                                                                    children: "Order ID"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                                    lineNumber: 535,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    className: "px-3 py-2",
                                                                    children: "Name"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                                    lineNumber: 536,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    className: "px-3 py-2",
                                                                    children: "Address"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                                    lineNumber: 537,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    className: "px-3 py-2",
                                                                    children: "Phone"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                                    lineNumber: 538,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    className: "px-3 py-2",
                                                                    children: "Products"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                                    lineNumber: 539,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    className: "px-3 py-2",
                                                                    children: "Notes"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                                    lineNumber: 540,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    className: "px-3 py-2",
                                                                    children: "Payment"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                                    lineNumber: 541,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    className: "px-3 py-2",
                                                                    children: "Amount"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                                    lineNumber: 542,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    className: "px-3 py-2",
                                                                    children: "Shipping"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                                    lineNumber: 543,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    className: "px-3 py-2",
                                                                    children: "Status"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                                    lineNumber: 544,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    className: "px-3 py-2",
                                                                    children: "Created"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                                    lineNumber: 545,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                            lineNumber: 534,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                        lineNumber: 533,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                                        children: [
                                                            filteredOrders.map((item, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                                    className: "border-t border-white/5",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                            className: "px-3 py-2",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                type: "button",
                                                                                onClick: ()=>setSelectedOrder(item),
                                                                                className: "text-left text-cyan-300 hover:underline",
                                                                                children: String(item.order_id ?? item.id ?? "-")
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                                                lineNumber: 555,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                                            lineNumber: 554,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                            className: "px-3 py-2",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                type: "button",
                                                                                onClick: ()=>setSelectedOrder(item),
                                                                                className: "text-left hover:underline",
                                                                                children: getOrderCustomerName(item)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                                                lineNumber: 564,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                                            lineNumber: 563,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                            className: "px-3 py-2",
                                                                            children: getOrderLocation(item)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                                            lineNumber: 572,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                            className: "px-3 py-2",
                                                                            children: getOrderContact(item)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                                            lineNumber: 573,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                            className: "px-3 py-2 max-w-[280px] break-words",
                                                                            children: getOrderProductNames(item)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                                            lineNumber: 574,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                            className: "px-3 py-2",
                                                                            children: String(item.notes ?? "-")
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                                            lineNumber: 577,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                            className: "px-3 py-2",
                                                                            children: String(item.payment_type ?? "-")
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                                            lineNumber: 578,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                            className: "px-3 py-2",
                                                                            children: [
                                                                                "Rs ",
                                                                                Number(item.total_amount ?? item.amount ?? 0).toFixed(2)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                                            lineNumber: 579,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                            className: "px-3 py-2",
                                                                            children: [
                                                                                "Rs ",
                                                                                Number(item.shipping_charge ?? 0).toFixed(2)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                                            lineNumber: 582,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                            className: "px-3 py-2",
                                                                            children: String(item.status ?? "-")
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                                            lineNumber: 585,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                            className: "px-3 py-2",
                                                                            children: item.created_at ? new Date(String(item.created_at)).toLocaleString() : "-"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                                            lineNumber: 586,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, String(item.id ?? item.order_id ?? `order-${i}`), true, {
                                                                    fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                                    lineNumber: 550,
                                                                    columnNumber: 27
                                                                }, this)),
                                                            !filteredOrders.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    colSpan: 11,
                                                                    className: "px-3 py-6 text-center text-slate-400",
                                                                    children: "No orders to display."
                                                                }, void 0, false, {
                                                                    fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                                    lineNumber: 595,
                                                                    columnNumber: 29
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                                lineNumber: 594,
                                                                columnNumber: 27
                                                            }, this) : null
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                        lineNumber: 548,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                lineNumber: 532,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                            lineNumber: 531,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                    lineNumber: 511,
                                    columnNumber: 17
                                }, this) : null
                            ]
                        }, void 0, true, {
                            fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                            lineNumber: 353,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                    lineNumber: 342,
                    columnNumber: 11
                }, this),
                selectedOrder ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: ()=>setSelectedOrder(null),
                            className: "fixed inset-0 z-40 bg-black/55",
                            "aria-label": "Close order details backdrop"
                        }, void 0, false, {
                            fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                            lineNumber: 610,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                            className: "fixed inset-0 z-50 flex items-center justify-center p-4",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "glass max-h-[90vh] w-full max-w-4xl overflow-auto rounded-2xl p-5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mb-4 flex items-center justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-xl font-semibold",
                                                children: "Order Details"
                                            }, void 0, false, {
                                                fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                lineNumber: 619,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>setSelectedOrder(null),
                                                className: "rounded-lg border px-3 py-1 text-sm hover:bg-white/5",
                                                children: "Close"
                                            }, void 0, false, {
                                                fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                lineNumber: 620,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                        lineNumber: 618,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid gap-3 text-sm sm:grid-cols-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DetailRow, {
                                                label: "Order ID",
                                                value: String(selectedOrder.order_id ?? selectedOrder.id ?? "-")
                                            }, void 0, false, {
                                                fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                lineNumber: 630,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DetailRow, {
                                                label: "Name",
                                                value: getOrderCustomerName(selectedOrder)
                                            }, void 0, false, {
                                                fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                lineNumber: 634,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DetailRow, {
                                                label: "Phone Number",
                                                value: getOrderContact(selectedOrder)
                                            }, void 0, false, {
                                                fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                lineNumber: 635,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DetailRow, {
                                                label: "Address",
                                                value: getOrderLocation(selectedOrder)
                                            }, void 0, false, {
                                                fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                lineNumber: 636,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DetailRow, {
                                                label: "Notes",
                                                value: String(selectedOrder.notes ?? "-")
                                            }, void 0, false, {
                                                fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                lineNumber: 637,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DetailRow, {
                                                label: "Payment",
                                                value: String(selectedOrder.payment_type ?? "-")
                                            }, void 0, false, {
                                                fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                lineNumber: 638,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DetailRow, {
                                                label: "Status",
                                                value: String(selectedOrder.status ?? "-")
                                            }, void 0, false, {
                                                fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                lineNumber: 639,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DetailRow, {
                                                label: "Total Amount",
                                                value: `Rs ${Number(selectedOrder.total_amount ?? selectedOrder.amount ?? 0).toFixed(2)}`
                                            }, void 0, false, {
                                                fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                lineNumber: 643,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                        lineNumber: 629,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                className: "mb-2 text-base font-medium",
                                                children: "Products (Estimate Bill)"
                                            }, void 0, false, {
                                                fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                lineNumber: 652,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "overflow-auto rounded-lg border border-white/10",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                                    className: "w-full text-left text-sm",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                                            className: "bg-slate-900/70 text-slate-300",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                        className: "px-3 py-2",
                                                                        children: "Product Name"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                                        lineNumber: 657,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                        className: "px-3 py-2",
                                                                        children: "Quantity"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                                        lineNumber: 658,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                        className: "px-3 py-2",
                                                                        children: "Price"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                                        lineNumber: 659,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                                lineNumber: 656,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                            lineNumber: 655,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                                            children: [
                                                                getOrderProductRows(selectedOrder).map((row, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                                        className: "border-t border-white/5",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                className: "px-3 py-2",
                                                                                children: row.name
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                                                lineNumber: 665,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                className: "px-3 py-2",
                                                                                children: row.quantity
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                                                lineNumber: 666,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                className: "px-3 py-2",
                                                                                children: [
                                                                                    "Rs ",
                                                                                    (row.price * row.quantity).toFixed(2)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                                                lineNumber: 667,
                                                                                columnNumber: 29
                                                                            }, this)
                                                                        ]
                                                                    }, `${row.name}-${idx}`, true, {
                                                                        fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                                        lineNumber: 664,
                                                                        columnNumber: 27
                                                                    }, this)),
                                                                !getOrderProductRows(selectedOrder).length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        colSpan: 3,
                                                                        className: "px-3 py-6 text-center text-slate-400",
                                                                        children: "No product line items available for this order."
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                                        lineNumber: 674,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                                    lineNumber: 673,
                                                                    columnNumber: 27
                                                                }, this) : null
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                            lineNumber: 662,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                    lineNumber: 654,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                                lineNumber: 653,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                        lineNumber: 651,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                                lineNumber: 617,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                            lineNumber: 616,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true) : null
            ]
        }, void 0, true, {
            fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
            lineNumber: 301,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
        lineNumber: 300,
        columnNumber: 5
    }, this);
}
_s(Home, "g2FR26HEwsQS/K8hETyh+TEFTY4=");
_c = Home;
function MetricCard({ label, value }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
        className: "glass rounded-2xl p-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-xs uppercase tracking-widest text-slate-400",
                children: label
            }, void 0, false, {
                fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                lineNumber: 695,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-2 text-2xl font-semibold text-cyan-200",
                children: value
            }, void 0, false, {
                fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                lineNumber: 696,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
        lineNumber: 694,
        columnNumber: 5
    }, this);
}
_c1 = MetricCard;
function Input({ label, value, onChange, type = "text" }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
        className: "block",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "mb-1 block text-xs text-slate-300",
                children: label
            }, void 0, false, {
                fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                lineNumber: 714,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                type: type,
                value: value,
                onChange: (e)=>onChange(e.target.value),
                className: "w-full rounded-lg border bg-slate-900/60 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-400"
            }, void 0, false, {
                fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                lineNumber: 715,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
        lineNumber: 713,
        columnNumber: 5
    }, this);
}
_c2 = Input;
function DetailRow({ label, value }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "rounded-lg border border-white/10 bg-slate-900/40 p-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-xs uppercase tracking-wider text-slate-400",
                children: label
            }, void 0, false, {
                fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                lineNumber: 728,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$e$2d$commerce_vendor$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-1 text-sm text-slate-100",
                children: value
            }, void 0, false, {
                fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
                lineNumber: 729,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/e-commerce_vendor/src/app/page.tsx",
        lineNumber: 727,
        columnNumber: 5
    }, this);
}
_c3 = DetailRow;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "Home");
__turbopack_context__.k.register(_c1, "MetricCard");
__turbopack_context__.k.register(_c2, "Input");
__turbopack_context__.k.register(_c3, "DetailRow");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=e-commerce_vendor_src_0yzr09g._.js.map