module.exports = [
"[turbopack-node]/transforms/postcss.ts { CONFIG => \"[project]/e-commerce_vendor/postcss.config.mjs [postcss] (ecmascript)\" } [postcss] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "chunks/00~p_03n698b._.js",
  "chunks/[root-of-the-server]__11lktii._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[turbopack-node]/transforms/postcss.ts { CONFIG => \"[project]/e-commerce_vendor/postcss.config.mjs [postcss] (ecmascript)\" } [postcss] (ecmascript)");
    });
});
}),
];