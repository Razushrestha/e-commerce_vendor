module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/e-commerce_vendor/src/app/api/vendor/products/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
const PRODUCT_API = process.env.NEXT_PUBLIC_PRODUCT_API ?? "http://36.253.137.34:8004/api/products/";
function getAuthHeader(request) {
    const auth = request.headers.get("authorization");
    return auth ?? "";
}
async function GET(request) {
    try {
        const upstream = await fetch(PRODUCT_API, {
            method: "GET",
            headers: {
                Authorization: getAuthHeader(request)
            }
        });
        const responseText = await upstream.text();
        return new Response(responseText, {
            status: upstream.status,
            headers: {
                "Content-Type": upstream.headers.get("Content-Type") ?? "application/json"
            }
        });
    } catch (error) {
        return Response.json({
            detail: "Unable to reach product service.",
            error: error instanceof Error ? error.message : "Unknown error"
        }, {
            status: 502
        });
    }
}
async function POST(request) {
    try {
        const formData = await request.formData();
        const submittedFields = Array.from(formData.keys());
        const imageFile = formData.get("image");
        const jsonPayload = {};
        const assignIfPresent = (key, parser)=>{
            const raw = formData.get(key);
            if (raw === null || raw instanceof File) return;
            const value = raw.toString().trim();
            if (value === "") return;
            jsonPayload[key] = parser ? parser(value) : value;
        };
        assignIfPresent("name");
        assignIfPresent("description");
        assignIfPresent("price", (v)=>Number(v).toFixed(2));
        assignIfPresent("stock", (v)=>Number(v));
        assignIfPresent("is_active", (v)=>v === "true");
        assignIfPresent("category", (v)=>Number(v));
        const multipartUpstream = await fetch(PRODUCT_API, {
            method: "POST",
            headers: {
                Authorization: getAuthHeader(request)
            },
            body: formData
        });
        const multipartText = await multipartUpstream.text();
        if (multipartUpstream.ok) {
            return new Response(multipartText, {
                status: multipartUpstream.status,
                headers: {
                    "Content-Type": multipartUpstream.headers.get("Content-Type") ?? "application/json"
                }
            });
        }
        // Fallback: strict JSON payload matching backend field examples.
        const jsonUpstream = await fetch(PRODUCT_API, {
            method: "POST",
            headers: {
                Authorization: getAuthHeader(request),
                "Content-Type": "application/json"
            },
            body: JSON.stringify(jsonPayload)
        });
        const jsonText = await jsonUpstream.text();
        if (jsonUpstream.ok) {
            let parsed = {};
            try {
                parsed = jsonText ? JSON.parse(jsonText) : {};
            } catch  {
                parsed = {};
            }
            return Response.json({
                ...parsed,
                warning: imageFile instanceof File ? "Product created using JSON fallback; backend likely rejected multipart image upload." : undefined
            }, {
                status: jsonUpstream.status
            });
        }
        if (!jsonUpstream.ok) {
            let multipartError = multipartText;
            try {
                multipartError = multipartText ? JSON.parse(multipartText) : {};
            } catch  {
            // leave as text
            }
            let jsonError = jsonText;
            try {
                jsonError = jsonText ? JSON.parse(jsonText) : {};
            } catch  {
            // leave as text
            }
            console.error("Product create failed:", {
                multipart_status: multipartUpstream.status,
                json_status: jsonUpstream.status,
                submittedFields,
                multipartError,
                jsonPayload,
                jsonError
            });
            return Response.json({
                detail: "Product validation failed on backend.",
                multipart_status: multipartUpstream.status,
                json_status: jsonUpstream.status,
                submitted_fields: submittedFields,
                multipart_error: multipartError,
                json_payload: jsonPayload,
                json_error: jsonError
            }, {
                status: jsonUpstream.status
            });
        }
        return new Response(jsonText, {
            status: jsonUpstream.status,
            headers: {
                "Content-Type": jsonUpstream.headers.get("Content-Type") ?? "application/json"
            }
        });
    } catch (error) {
        return Response.json({
            detail: "Unable to submit product to backend.",
            error: error instanceof Error ? error.message : "Unknown error"
        }, {
            status: 502
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1142i2u._.js.map