"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/menu/[id]/route";
exports.ids = ["app/api/menu/[id]/route"];
exports.modules = {

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ "../../client/components/action-async-storage.external":
/*!*******************************************************************************!*\
  !*** external "next/dist/client/components/action-async-storage.external.js" ***!
  \*******************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/action-async-storage.external.js");

/***/ }),

/***/ "../../client/components/request-async-storage.external":
/*!********************************************************************************!*\
  !*** external "next/dist/client/components/request-async-storage.external.js" ***!
  \********************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/request-async-storage.external.js");

/***/ }),

/***/ "../../client/components/static-generation-async-storage.external":
/*!******************************************************************************************!*\
  !*** external "next/dist/client/components/static-generation-async-storage.external.js" ***!
  \******************************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/static-generation-async-storage.external.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "assert":
/*!*************************!*\
  !*** external "assert" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("assert");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("buffer");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("events");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

module.exports = require("https");

/***/ }),

/***/ "querystring":
/*!******************************!*\
  !*** external "querystring" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("querystring");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("util");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("zlib");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fmenu%2F%5Bid%5D%2Froute&page=%2Fapi%2Fmenu%2F%5Bid%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fmenu%2F%5Bid%5D%2Froute.ts&appDir=C%3A%5CUsers%5CMSI1%5CDesktop%5Csaas_restaurant%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CMSI1%5CDesktop%5Csaas_restaurant&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fmenu%2F%5Bid%5D%2Froute&page=%2Fapi%2Fmenu%2F%5Bid%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fmenu%2F%5Bid%5D%2Froute.ts&appDir=C%3A%5CUsers%5CMSI1%5CDesktop%5Csaas_restaurant%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CMSI1%5CDesktop%5Csaas_restaurant&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var C_Users_MSI1_Desktop_saas_restaurant_app_api_menu_id_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/menu/[id]/route.ts */ \"(rsc)/./app/api/menu/[id]/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/menu/[id]/route\",\n        pathname: \"/api/menu/[id]\",\n        filename: \"route\",\n        bundlePath: \"app/api/menu/[id]/route\"\n    },\n    resolvedPagePath: \"C:\\\\Users\\\\MSI1\\\\Desktop\\\\saas_restaurant\\\\app\\\\api\\\\menu\\\\[id]\\\\route.ts\",\n    nextConfigOutput,\n    userland: C_Users_MSI1_Desktop_saas_restaurant_app_api_menu_id_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks } = routeModule;\nconst originalPathname = \"/api/menu/[id]/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZtZW51JTJGJTVCaWQlNUQlMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRm1lbnUlMkYlNUJpZCU1RCUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRm1lbnUlMkYlNUJpZCU1RCUyRnJvdXRlLnRzJmFwcERpcj1DJTNBJTVDVXNlcnMlNUNNU0kxJTVDRGVza3RvcCU1Q3NhYXNfcmVzdGF1cmFudCU1Q2FwcCZwYWdlRXh0ZW5zaW9ucz10c3gmcGFnZUV4dGVuc2lvbnM9dHMmcGFnZUV4dGVuc2lvbnM9anN4JnBhZ2VFeHRlbnNpb25zPWpzJnJvb3REaXI9QyUzQSU1Q1VzZXJzJTVDTVNJMSU1Q0Rlc2t0b3AlNUNzYWFzX3Jlc3RhdXJhbnQmaXNEZXY9dHJ1ZSZ0c2NvbmZpZ1BhdGg9dHNjb25maWcuanNvbiZiYXNlUGF0aD0mYXNzZXRQcmVmaXg9Jm5leHRDb25maWdPdXRwdXQ9JnByZWZlcnJlZFJlZ2lvbj0mbWlkZGxld2FyZUNvbmZpZz1lMzAlM0QhIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFzRztBQUN2QztBQUNjO0FBQ3lCO0FBQ3RHO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixnSEFBbUI7QUFDM0M7QUFDQSxjQUFjLHlFQUFTO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxZQUFZO0FBQ1osQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLFFBQVEsaUVBQWlFO0FBQ3pFO0FBQ0E7QUFDQSxXQUFXLDRFQUFXO0FBQ3RCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDdUg7O0FBRXZIIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc2Fhc19yZXN0YXVyYW50Lz80YjZlIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcFJvdXRlUm91dGVNb2R1bGUgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9mdXR1cmUvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9mdXR1cmUvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgcGF0Y2hGZXRjaCBhcyBfcGF0Y2hGZXRjaCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9wYXRjaC1mZXRjaFwiO1xuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIkM6XFxcXFVzZXJzXFxcXE1TSTFcXFxcRGVza3RvcFxcXFxzYWFzX3Jlc3RhdXJhbnRcXFxcYXBwXFxcXGFwaVxcXFxtZW51XFxcXFtpZF1cXFxccm91dGUudHNcIjtcbi8vIFdlIGluamVjdCB0aGUgbmV4dENvbmZpZ091dHB1dCBoZXJlIHNvIHRoYXQgd2UgY2FuIHVzZSB0aGVtIGluIHRoZSByb3V0ZVxuLy8gbW9kdWxlLlxuY29uc3QgbmV4dENvbmZpZ091dHB1dCA9IFwiXCJcbmNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFJvdXRlUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgcGFnZTogXCIvYXBpL21lbnUvW2lkXS9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL21lbnUvW2lkXVwiLFxuICAgICAgICBmaWxlbmFtZTogXCJyb3V0ZVwiLFxuICAgICAgICBidW5kbGVQYXRoOiBcImFwcC9hcGkvbWVudS9baWRdL3JvdXRlXCJcbiAgICB9LFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiQzpcXFxcVXNlcnNcXFxcTVNJMVxcXFxEZXNrdG9wXFxcXHNhYXNfcmVzdGF1cmFudFxcXFxhcHBcXFxcYXBpXFxcXG1lbnVcXFxcW2lkXVxcXFxyb3V0ZS50c1wiLFxuICAgIG5leHRDb25maWdPdXRwdXQsXG4gICAgdXNlcmxhbmRcbn0pO1xuLy8gUHVsbCBvdXQgdGhlIGV4cG9ydHMgdGhhdCB3ZSBuZWVkIHRvIGV4cG9zZSBmcm9tIHRoZSBtb2R1bGUuIFRoaXMgc2hvdWxkXG4vLyBiZSBlbGltaW5hdGVkIHdoZW4gd2UndmUgbW92ZWQgdGhlIG90aGVyIHJvdXRlcyB0byB0aGUgbmV3IGZvcm1hdC4gVGhlc2Vcbi8vIGFyZSB1c2VkIHRvIGhvb2sgaW50byB0aGUgcm91dGUuXG5jb25zdCB7IHJlcXVlc3RBc3luY1N0b3JhZ2UsIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmNvbnN0IG9yaWdpbmFsUGF0aG5hbWUgPSBcIi9hcGkvbWVudS9baWRdL3JvdXRlXCI7XG5mdW5jdGlvbiBwYXRjaEZldGNoKCkge1xuICAgIHJldHVybiBfcGF0Y2hGZXRjaCh7XG4gICAgICAgIHNlcnZlckhvb2tzLFxuICAgICAgICBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlXG4gICAgfSk7XG59XG5leHBvcnQgeyByb3V0ZU1vZHVsZSwgcmVxdWVzdEFzeW5jU3RvcmFnZSwgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIG9yaWdpbmFsUGF0aG5hbWUsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fmenu%2F%5Bid%5D%2Froute&page=%2Fapi%2Fmenu%2F%5Bid%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fmenu%2F%5Bid%5D%2Froute.ts&appDir=C%3A%5CUsers%5CMSI1%5CDesktop%5Csaas_restaurant%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CMSI1%5CDesktop%5Csaas_restaurant&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./app/api/menu/[id]/route.ts":
/*!************************************!*\
  !*** ./app/api/menu/[id]/route.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   DELETE: () => (/* binding */ DELETE),\n/* harmony export */   PATCH: () => (/* binding */ PATCH)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next-auth */ \"(rsc)/./node_modules/next-auth/index.js\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_auth__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _lib_auth__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/lib/auth */ \"(rsc)/./lib/auth.ts\");\n/* harmony import */ var _lib_prisma__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/lib/prisma */ \"(rsc)/./lib/prisma.ts\");\n/* harmony import */ var zod__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! zod */ \"(rsc)/./node_modules/zod/v3/types.js\");\n\n\n\n\n\nconst updateSchema = zod__WEBPACK_IMPORTED_MODULE_4__.object({\n    name: zod__WEBPACK_IMPORTED_MODULE_4__.string().min(1).optional(),\n    description: zod__WEBPACK_IMPORTED_MODULE_4__.string().optional().nullable(),\n    price: zod__WEBPACK_IMPORTED_MODULE_4__.number().positive().optional(),\n    image: zod__WEBPACK_IMPORTED_MODULE_4__.string().optional().nullable(),\n    categoryId: zod__WEBPACK_IMPORTED_MODULE_4__.string().optional(),\n    visible: zod__WEBPACK_IMPORTED_MODULE_4__.boolean().optional(),\n    stock: zod__WEBPACK_IMPORTED_MODULE_4__.number().int().min(0).nullable().optional(),\n    barcode: zod__WEBPACK_IMPORTED_MODULE_4__.string().optional().nullable()\n});\nasync function PATCH(req, { params }) {\n    const session = await (0,next_auth__WEBPACK_IMPORTED_MODULE_1__.getServerSession)(_lib_auth__WEBPACK_IMPORTED_MODULE_2__.authOptions);\n    if (!session) return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        error: \"Unauthorized\"\n    }, {\n        status: 401\n    });\n    const { id } = await params;\n    const body = await req.json();\n    const parsed = updateSchema.safeParse({\n        ...body,\n        price: body.price != null ? typeof body.price === \"string\" ? parseFloat(body.price) : body.price : undefined,\n        stock: body.stock === \"\" || body.stock === undefined ? undefined : typeof body.stock === \"string\" ? parseInt(body.stock, 10) : body.stock,\n        barcode: body.barcode === undefined ? undefined : body.barcode === \"\" ? null : body.barcode\n    });\n    if (!parsed.success) return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        error: \"Invalid input\"\n    }, {\n        status: 400\n    });\n    const data = {};\n    if (parsed.data.name != null) data.name = parsed.data.name;\n    if (parsed.data.description !== undefined) data.description = parsed.data.description;\n    if (parsed.data.price != null) data.price = parsed.data.price;\n    if (parsed.data.image !== undefined) data.image = parsed.data.image;\n    if (parsed.data.categoryId != null) data.categoryId = parsed.data.categoryId;\n    if (parsed.data.visible !== undefined) data.visible = parsed.data.visible;\n    if (parsed.data.stock !== undefined) data.stock = parsed.data.stock;\n    if (parsed.data.barcode !== undefined) data.barcode = parsed.data.barcode;\n    const item = await _lib_prisma__WEBPACK_IMPORTED_MODULE_3__.prisma.menuItem.update({\n        where: {\n            id\n        },\n        data,\n        include: {\n            category: true\n        }\n    });\n    return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(item);\n}\nasync function DELETE(_req, { params }) {\n    const session = await (0,next_auth__WEBPACK_IMPORTED_MODULE_1__.getServerSession)(_lib_auth__WEBPACK_IMPORTED_MODULE_2__.authOptions);\n    if (!session) return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        error: \"Unauthorized\"\n    }, {\n        status: 401\n    });\n    const { id } = await params;\n    await _lib_prisma__WEBPACK_IMPORTED_MODULE_3__.prisma.menuItem.delete({\n        where: {\n            id\n        }\n    });\n    return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        ok: true\n    });\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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SSxDQUFDbEIsS0FBSyxLQUFLZSxXQUFXRyxLQUFLbEIsS0FBSyxHQUFHWSxPQUFPTSxJQUFJLENBQUNsQixLQUFLO0lBQ25FLElBQUlZLE9BQU9NLElBQUksQ0FBQ2hCLE9BQU8sS0FBS2EsV0FBV0csS0FBS2hCLE9BQU8sR0FBR1UsT0FBT00sSUFBSSxDQUFDaEIsT0FBTztJQUN6RSxNQUFNaUIsT0FBTyxNQUFNcEMsK0NBQU1BLENBQUNxQyxRQUFRLENBQUNDLE1BQU0sQ0FBQztRQUN4Q0MsT0FBTztZQUFFWjtRQUFHO1FBQ1pRO1FBQ0FLLFNBQVM7WUFBRUMsVUFBVTtRQUFLO0lBQzVCO0lBQ0EsT0FBTzVDLHFEQUFZQSxDQUFDMkIsSUFBSSxDQUFDWTtBQUMzQjtBQUVPLGVBQWVNLE9BQ3BCQyxJQUFhLEVBQ2IsRUFBRXJCLE1BQU0sRUFBdUM7SUFFL0MsTUFBTUMsVUFBVSxNQUFNekIsMkRBQWdCQSxDQUFDQyxrREFBV0E7SUFDbEQsSUFBSSxDQUFDd0IsU0FBUyxPQUFPMUIscURBQVlBLENBQUMyQixJQUFJLENBQUM7UUFBRUMsT0FBTztJQUFlLEdBQUc7UUFBRUMsUUFBUTtJQUFJO0lBQ2hGLE1BQU0sRUFBRUMsRUFBRSxFQUFFLEdBQUcsTUFBTUw7SUFDckIsTUFBTXRCLCtDQUFNQSxDQUFDcUMsUUFBUSxDQUFDTyxNQUFNLENBQUM7UUFBRUwsT0FBTztZQUFFWjtRQUFHO0lBQUU7SUFDN0MsT0FBTzlCLHFEQUFZQSxDQUFDMkIsSUFBSSxDQUFDO1FBQUVxQixJQUFJO0lBQUs7QUFDdEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zYWFzX3Jlc3RhdXJhbnQvLi9hcHAvYXBpL21lbnUvW2lkXS9yb3V0ZS50cz8yMWEwIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5leHRSZXNwb25zZSB9IGZyb20gXCJuZXh0L3NlcnZlclwiO1xuaW1wb3J0IHsgZ2V0U2VydmVyU2Vzc2lvbiB9IGZyb20gXCJuZXh0LWF1dGhcIjtcbmltcG9ydCB7IGF1dGhPcHRpb25zIH0gZnJvbSBcIkAvbGliL2F1dGhcIjtcbmltcG9ydCB7IHByaXNtYSB9IGZyb20gXCJAL2xpYi9wcmlzbWFcIjtcbmltcG9ydCB7IHogfSBmcm9tIFwiem9kXCI7XG5cbmNvbnN0IHVwZGF0ZVNjaGVtYSA9IHoub2JqZWN0KHtcbiAgbmFtZTogei5zdHJpbmcoKS5taW4oMSkub3B0aW9uYWwoKSxcbiAgZGVzY3JpcHRpb246IHouc3RyaW5nKCkub3B0aW9uYWwoKS5udWxsYWJsZSgpLFxuICBwcmljZTogei5udW1iZXIoKS5wb3NpdGl2ZSgpLm9wdGlvbmFsKCksXG4gIGltYWdlOiB6LnN0cmluZygpLm9wdGlvbmFsKCkubnVsbGFibGUoKSxcbiAgY2F0ZWdvcnlJZDogei5zdHJpbmcoKS5vcHRpb25hbCgpLFxuICB2aXNpYmxlOiB6LmJvb2xlYW4oKS5vcHRpb25hbCgpLFxuICBzdG9jazogei5udW1iZXIoKS5pbnQoKS5taW4oMCkubnVsbGFibGUoKS5vcHRpb25hbCgpLFxuICBiYXJjb2RlOiB6LnN0cmluZygpLm9wdGlvbmFsKCkubnVsbGFibGUoKSxcbn0pO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUEFUQ0goXG4gIHJlcTogUmVxdWVzdCxcbiAgeyBwYXJhbXMgfTogeyBwYXJhbXM6IFByb21pc2U8eyBpZDogc3RyaW5nIH0+IH1cbikge1xuICBjb25zdCBzZXNzaW9uID0gYXdhaXQgZ2V0U2VydmVyU2Vzc2lvbihhdXRoT3B0aW9ucyk7XG4gIGlmICghc2Vzc2lvbikgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZXJyb3I6IFwiVW5hdXRob3JpemVkXCIgfSwgeyBzdGF0dXM6IDQwMSB9KTtcbiAgY29uc3QgeyBpZCB9ID0gYXdhaXQgcGFyYW1zO1xuICBjb25zdCBib2R5ID0gYXdhaXQgcmVxLmpzb24oKTtcbiAgY29uc3QgcGFyc2VkID0gdXBkYXRlU2NoZW1hLnNhZmVQYXJzZSh7XG4gICAgLi4uYm9keSxcbiAgICBwcmljZTogYm9keS5wcmljZSAhPSBudWxsID8gKHR5cGVvZiBib2R5LnByaWNlID09PSBcInN0cmluZ1wiID8gcGFyc2VGbG9hdChib2R5LnByaWNlKSA6IGJvZHkucHJpY2UpIDogdW5kZWZpbmVkLFxuICAgIHN0b2NrOiBib2R5LnN0b2NrID09PSBcIlwiIHx8IGJvZHkuc3RvY2sgPT09IHVuZGVmaW5lZCA/IHVuZGVmaW5lZCA6ICh0eXBlb2YgYm9keS5zdG9jayA9PT0gXCJzdHJpbmdcIiA/IHBhcnNlSW50KGJvZHkuc3RvY2ssIDEwKSA6IGJvZHkuc3RvY2spLFxuICAgIGJhcmNvZGU6IGJvZHkuYmFyY29kZSA9PT0gdW5kZWZpbmVkID8gdW5kZWZpbmVkIDogKGJvZHkuYmFyY29kZSA9PT0gXCJcIiA/IG51bGwgOiBib2R5LmJhcmNvZGUpLFxuICB9KTtcbiAgaWYgKCFwYXJzZWQuc3VjY2VzcykgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZXJyb3I6IFwiSW52YWxpZCBpbnB1dFwiIH0sIHsgc3RhdHVzOiA0MDAgfSk7XG4gIGNvbnN0IGRhdGE6IFJlY29yZDxzdHJpbmcsIHVua25vd24+ID0ge307XG4gIGlmIChwYXJzZWQuZGF0YS5uYW1lICE9IG51bGwpIGRhdGEubmFtZSA9IHBhcnNlZC5kYXRhLm5hbWU7XG4gIGlmIChwYXJzZWQuZGF0YS5kZXNjcmlwdGlvbiAhPT0gdW5kZWZpbmVkKSBkYXRhLmRlc2NyaXB0aW9uID0gcGFyc2VkLmRhdGEuZGVzY3JpcHRpb247XG4gIGlmIChwYXJzZWQuZGF0YS5wcmljZSAhPSBudWxsKSBkYXRhLnByaWNlID0gcGFyc2VkLmRhdGEucHJpY2U7XG4gIGlmIChwYXJzZWQuZGF0YS5pbWFnZSAhPT0gdW5kZWZpbmVkKSBkYXRhLmltYWdlID0gcGFyc2VkLmRhdGEuaW1hZ2U7XG4gIGlmIChwYXJzZWQuZGF0YS5jYXRlZ29yeUlkICE9IG51bGwpIGRhdGEuY2F0ZWdvcnlJZCA9IHBhcnNlZC5kYXRhLmNhdGVnb3J5SWQ7XG4gIGlmIChwYXJzZWQuZGF0YS52aXNpYmxlICE9PSB1bmRlZmluZWQpIGRhdGEudmlzaWJsZSA9IHBhcnNlZC5kYXRhLnZpc2libGU7XG4gIGlmIChwYXJzZWQuZGF0YS5zdG9jayAhPT0gdW5kZWZpbmVkKSBkYXRhLnN0b2NrID0gcGFyc2VkLmRhdGEuc3RvY2s7XG4gIGlmIChwYXJzZWQuZGF0YS5iYXJjb2RlICE9PSB1bmRlZmluZWQpIGRhdGEuYmFyY29kZSA9IHBhcnNlZC5kYXRhLmJhcmNvZGU7XG4gIGNvbnN0IGl0ZW0gPSBhd2FpdCBwcmlzbWEubWVudUl0ZW0udXBkYXRlKHtcbiAgICB3aGVyZTogeyBpZCB9LFxuICAgIGRhdGEsXG4gICAgaW5jbHVkZTogeyBjYXRlZ29yeTogdHJ1ZSB9LFxuICB9KTtcbiAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKGl0ZW0pO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gREVMRVRFKFxuICBfcmVxOiBSZXF1ZXN0LFxuICB7IHBhcmFtcyB9OiB7IHBhcmFtczogUHJvbWlzZTx7IGlkOiBzdHJpbmcgfT4gfVxuKSB7XG4gIGNvbnN0IHNlc3Npb24gPSBhd2FpdCBnZXRTZXJ2ZXJTZXNzaW9uKGF1dGhPcHRpb25zKTtcbiAgaWYgKCFzZXNzaW9uKSByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogXCJVbmF1dGhvcml6ZWRcIiB9LCB7IHN0YXR1czogNDAxIH0pO1xuICBjb25zdCB7IGlkIH0gPSBhd2FpdCBwYXJhbXM7XG4gIGF3YWl0IHByaXNtYS5tZW51SXRlbS5kZWxldGUoeyB3aGVyZTogeyBpZCB9IH0pO1xuICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBvazogdHJ1ZSB9KTtcbn1cbiJdLCJuYW1lcyI6WyJOZXh0UmVzcG9uc2UiLCJnZXRTZXJ2ZXJTZXNzaW9uIiwiYXV0aE9wdGlvbnMiLCJwcmlzbWEiLCJ6IiwidXBkYXRlU2NoZW1hIiwib2JqZWN0IiwibmFtZSIsInN0cmluZyIsIm1pbiIsIm9wdGlvbmFsIiwiZGVzY3JpcHRpb24iLCJudWxsYWJsZSIsInByaWNlIiwibnVtYmVyIiwicG9zaXRpdmUiLCJpbWFnZSIsImNhdGVnb3J5SWQiLCJ2aXNpYmxlIiwiYm9vbGVhbiIsInN0b2NrIiwiaW50IiwiYmFyY29kZSIsIlBBVENIIiwicmVxIiwicGFyYW1zIiwic2Vzc2lvbiIsImpzb24iLCJlcnJvciIsInN0YXR1cyIsImlkIiwiYm9keSIsInBhcnNlZCIsInNhZmVQYXJzZSIsInBhcnNlRmxvYXQiLCJ1bmRlZmluZWQiLCJwYXJzZUludCIsInN1Y2Nlc3MiLCJkYXRhIiwiaXRlbSIsIm1lbnVJdGVtIiwidXBkYXRlIiwid2hlcmUiLCJpbmNsdWRlIiwiY2F0ZWdvcnkiLCJERUxFVEUiLCJfcmVxIiwiZGVsZXRlIiwib2siXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./app/api/menu/[id]/route.ts\n");

/***/ }),

/***/ "(rsc)/./lib/auth.ts":
/*!*********************!*\
  !*** ./lib/auth.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   authOptions: () => (/* binding */ authOptions)\n/* harmony export */ });\n/* harmony import */ var next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next-auth/providers/credentials */ \"(rsc)/./node_modules/next-auth/providers/credentials.js\");\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! bcryptjs */ \"(rsc)/./node_modules/bcryptjs/index.js\");\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(bcryptjs__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _prisma__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./prisma */ \"(rsc)/./lib/prisma.ts\");\n\n\n\nconst secret = process.env.NEXTAUTH_SECRET || \"restaurant-pos-dev-secret-min-32-chars-long\";\nconst authOptions = {\n    secret,\n    session: {\n        strategy: \"jwt\",\n        maxAge: 30 * 24 * 60 * 60\n    },\n    pages: {\n        signIn: \"/admin/login\"\n    },\n    providers: [\n        (0,next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_0__[\"default\"])({\n            name: \"credentials\",\n            credentials: {\n                email: {\n                    label: \"Email\",\n                    type: \"email\"\n                },\n                password: {\n                    label: \"Password\",\n                    type: \"password\"\n                }\n            },\n            async authorize (credentials) {\n                if (!credentials?.email || !credentials?.password) return null;\n                try {\n                    const user = await _prisma__WEBPACK_IMPORTED_MODULE_2__.prisma.user.findUnique({\n                        where: {\n                            email: credentials.email\n                        }\n                    });\n                    if (!user) return null;\n                    let valid = false;\n                    try {\n                        valid = await (0,bcryptjs__WEBPACK_IMPORTED_MODULE_1__.compare)(credentials.password, user.password);\n                    } catch (_) {\n                        return null;\n                    }\n                    if (!valid) return null;\n                    return {\n                        id: String(user.id),\n                        email: String(user.email),\n                        name: String(user.name),\n                        role: String(user.role)\n                    };\n                } catch (err) {\n                    console.error(\"NextAuth authorize error:\", err);\n                    return null;\n                }\n            }\n        })\n    ],\n    callbacks: {\n        async jwt ({ token, user }) {\n            if (user) {\n                token.id = user.id;\n                token.role = user.role ?? \"STAFF\";\n            }\n            return token;\n        },\n        async session ({ session, token }) {\n            if (session?.user) {\n                session.user.id = typeof token.id === \"string\" ? token.id : \"\";\n                session.user.role = typeof token.role === \"string\" ? token.role : \"STAFF\";\n            }\n            return session;\n        }\n    },\n    debug: \"development\" === \"development\"\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvYXV0aC50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUNrRTtBQUMvQjtBQUNEO0FBRWxDLE1BQU1HLFNBQVNDLFFBQVFDLEdBQUcsQ0FBQ0MsZUFBZSxJQUFJO0FBRXZDLE1BQU1DLGNBQStCO0lBQzFDSjtJQUNBSyxTQUFTO1FBQUVDLFVBQVU7UUFBT0MsUUFBUSxLQUFLLEtBQUssS0FBSztJQUFHO0lBQ3REQyxPQUFPO1FBQUVDLFFBQVE7SUFBZTtJQUNoQ0MsV0FBVztRQUNUYiwyRUFBbUJBLENBQUM7WUFDbEJjLE1BQU07WUFDTkMsYUFBYTtnQkFDWEMsT0FBTztvQkFBRUMsT0FBTztvQkFBU0MsTUFBTTtnQkFBUTtnQkFDdkNDLFVBQVU7b0JBQUVGLE9BQU87b0JBQVlDLE1BQU07Z0JBQVc7WUFDbEQ7WUFDQSxNQUFNRSxXQUFVTCxXQUFXO2dCQUN6QixJQUFJLENBQUNBLGFBQWFDLFNBQVMsQ0FBQ0QsYUFBYUksVUFBVSxPQUFPO2dCQUMxRCxJQUFJO29CQUNGLE1BQU1FLE9BQU8sTUFBTW5CLDJDQUFNQSxDQUFDbUIsSUFBSSxDQUFDQyxVQUFVLENBQUM7d0JBQ3hDQyxPQUFPOzRCQUFFUCxPQUFPRCxZQUFZQyxLQUFLO3dCQUFDO29CQUNwQztvQkFDQSxJQUFJLENBQUNLLE1BQU0sT0FBTztvQkFDbEIsSUFBSUcsUUFBUTtvQkFDWixJQUFJO3dCQUNGQSxRQUFRLE1BQU12QixpREFBT0EsQ0FBQ2MsWUFBWUksUUFBUSxFQUFFRSxLQUFLRixRQUFRO29CQUMzRCxFQUFFLE9BQU9NLEdBQUc7d0JBQ1YsT0FBTztvQkFDVDtvQkFDQSxJQUFJLENBQUNELE9BQU8sT0FBTztvQkFDbkIsT0FBTzt3QkFDTEUsSUFBSUMsT0FBT04sS0FBS0ssRUFBRTt3QkFDbEJWLE9BQU9XLE9BQU9OLEtBQUtMLEtBQUs7d0JBQ3hCRixNQUFNYSxPQUFPTixLQUFLUCxJQUFJO3dCQUN0QmMsTUFBTUQsT0FBT04sS0FBS08sSUFBSTtvQkFDeEI7Z0JBQ0YsRUFBRSxPQUFPQyxLQUFLO29CQUNaQyxRQUFRQyxLQUFLLENBQUMsNkJBQTZCRjtvQkFDM0MsT0FBTztnQkFDVDtZQUNGO1FBQ0Y7S0FDRDtJQUNERyxXQUFXO1FBQ1QsTUFBTUMsS0FBSSxFQUFFQyxLQUFLLEVBQUViLElBQUksRUFBRTtZQUN2QixJQUFJQSxNQUFNO2dCQUNSYSxNQUFNUixFQUFFLEdBQUdMLEtBQUtLLEVBQUU7Z0JBQ2xCUSxNQUFNTixJQUFJLEdBQUcsS0FBNEJBLElBQUksSUFBSTtZQUNuRDtZQUNBLE9BQU9NO1FBQ1Q7UUFDQSxNQUFNMUIsU0FBUSxFQUFFQSxPQUFPLEVBQUUwQixLQUFLLEVBQUU7WUFDOUIsSUFBSTFCLFNBQVNhLE1BQU07Z0JBQ2hCYixRQUFRYSxJQUFJLENBQXFCSyxFQUFFLEdBQUcsT0FBT1EsTUFBTVIsRUFBRSxLQUFLLFdBQVdRLE1BQU1SLEVBQUUsR0FBRztnQkFDaEZsQixRQUFRYSxJQUFJLENBQXVCTyxJQUFJLEdBQUcsT0FBT00sTUFBTU4sSUFBSSxLQUFLLFdBQVdNLE1BQU1OLElBQUksR0FBRztZQUMzRjtZQUNBLE9BQU9wQjtRQUNUO0lBQ0Y7SUFDQTJCLE9BQU8vQixrQkFBeUI7QUFDbEMsRUFBRSIsInNvdXJjZXMiOlsid2VicGFjazovL3NhYXNfcmVzdGF1cmFudC8uL2xpYi9hdXRoLnRzP2JmN2UiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmV4dEF1dGhPcHRpb25zIH0gZnJvbSBcIm5leHQtYXV0aFwiO1xuaW1wb3J0IENyZWRlbnRpYWxzUHJvdmlkZXIgZnJvbSBcIm5leHQtYXV0aC9wcm92aWRlcnMvY3JlZGVudGlhbHNcIjtcbmltcG9ydCB7IGNvbXBhcmUgfSBmcm9tIFwiYmNyeXB0anNcIjtcbmltcG9ydCB7IHByaXNtYSB9IGZyb20gXCIuL3ByaXNtYVwiO1xuXG5jb25zdCBzZWNyZXQgPSBwcm9jZXNzLmVudi5ORVhUQVVUSF9TRUNSRVQgfHwgXCJyZXN0YXVyYW50LXBvcy1kZXYtc2VjcmV0LW1pbi0zMi1jaGFycy1sb25nXCI7XG5cbmV4cG9ydCBjb25zdCBhdXRoT3B0aW9uczogTmV4dEF1dGhPcHRpb25zID0ge1xuICBzZWNyZXQsXG4gIHNlc3Npb246IHsgc3RyYXRlZ3k6IFwiand0XCIsIG1heEFnZTogMzAgKiAyNCAqIDYwICogNjAgfSxcbiAgcGFnZXM6IHsgc2lnbkluOiBcIi9hZG1pbi9sb2dpblwiIH0sXG4gIHByb3ZpZGVyczogW1xuICAgIENyZWRlbnRpYWxzUHJvdmlkZXIoe1xuICAgICAgbmFtZTogXCJjcmVkZW50aWFsc1wiLFxuICAgICAgY3JlZGVudGlhbHM6IHtcbiAgICAgICAgZW1haWw6IHsgbGFiZWw6IFwiRW1haWxcIiwgdHlwZTogXCJlbWFpbFwiIH0sXG4gICAgICAgIHBhc3N3b3JkOiB7IGxhYmVsOiBcIlBhc3N3b3JkXCIsIHR5cGU6IFwicGFzc3dvcmRcIiB9LFxuICAgICAgfSxcbiAgICAgIGFzeW5jIGF1dGhvcml6ZShjcmVkZW50aWFscykge1xuICAgICAgICBpZiAoIWNyZWRlbnRpYWxzPy5lbWFpbCB8fCAhY3JlZGVudGlhbHM/LnBhc3N3b3JkKSByZXR1cm4gbnVsbDtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCB1c2VyID0gYXdhaXQgcHJpc21hLnVzZXIuZmluZFVuaXF1ZSh7XG4gICAgICAgICAgICB3aGVyZTogeyBlbWFpbDogY3JlZGVudGlhbHMuZW1haWwgfSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAoIXVzZXIpIHJldHVybiBudWxsO1xuICAgICAgICAgIGxldCB2YWxpZCA9IGZhbHNlO1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICB2YWxpZCA9IGF3YWl0IGNvbXBhcmUoY3JlZGVudGlhbHMucGFzc3dvcmQsIHVzZXIucGFzc3dvcmQpO1xuICAgICAgICAgIH0gY2F0Y2ggKF8pIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoIXZhbGlkKSByZXR1cm4gbnVsbDtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaWQ6IFN0cmluZyh1c2VyLmlkKSxcbiAgICAgICAgICAgIGVtYWlsOiBTdHJpbmcodXNlci5lbWFpbCksXG4gICAgICAgICAgICBuYW1lOiBTdHJpbmcodXNlci5uYW1lKSxcbiAgICAgICAgICAgIHJvbGU6IFN0cmluZyh1c2VyLnJvbGUpLFxuICAgICAgICAgIH07XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJOZXh0QXV0aCBhdXRob3JpemUgZXJyb3I6XCIsIGVycik7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfSksXG4gIF0sXG4gIGNhbGxiYWNrczoge1xuICAgIGFzeW5jIGp3dCh7IHRva2VuLCB1c2VyIH0pIHtcbiAgICAgIGlmICh1c2VyKSB7XG4gICAgICAgIHRva2VuLmlkID0gdXNlci5pZDtcbiAgICAgICAgdG9rZW4ucm9sZSA9ICh1c2VyIGFzIHsgcm9sZT86IHN0cmluZyB9KS5yb2xlID8/IFwiU1RBRkZcIjtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0b2tlbjtcbiAgICB9LFxuICAgIGFzeW5jIHNlc3Npb24oeyBzZXNzaW9uLCB0b2tlbiB9KSB7XG4gICAgICBpZiAoc2Vzc2lvbj8udXNlcikge1xuICAgICAgICAoc2Vzc2lvbi51c2VyIGFzIHsgaWQ/OiBzdHJpbmcgfSkuaWQgPSB0eXBlb2YgdG9rZW4uaWQgPT09IFwic3RyaW5nXCIgPyB0b2tlbi5pZCA6IFwiXCI7XG4gICAgICAgIChzZXNzaW9uLnVzZXIgYXMgeyByb2xlPzogc3RyaW5nIH0pLnJvbGUgPSB0eXBlb2YgdG9rZW4ucm9sZSA9PT0gXCJzdHJpbmdcIiA/IHRva2VuLnJvbGUgOiBcIlNUQUZGXCI7XG4gICAgICB9XG4gICAgICByZXR1cm4gc2Vzc2lvbjtcbiAgICB9LFxuICB9LFxuICBkZWJ1ZzogcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwiZGV2ZWxvcG1lbnRcIixcbn07XG4iXSwibmFtZXMiOlsiQ3JlZGVudGlhbHNQcm92aWRlciIsImNvbXBhcmUiLCJwcmlzbWEiLCJzZWNyZXQiLCJwcm9jZXNzIiwiZW52IiwiTkVYVEFVVEhfU0VDUkVUIiwiYXV0aE9wdGlvbnMiLCJzZXNzaW9uIiwic3RyYXRlZ3kiLCJtYXhBZ2UiLCJwYWdlcyIsInNpZ25JbiIsInByb3ZpZGVycyIsIm5hbWUiLCJjcmVkZW50aWFscyIsImVtYWlsIiwibGFiZWwiLCJ0eXBlIiwicGFzc3dvcmQiLCJhdXRob3JpemUiLCJ1c2VyIiwiZmluZFVuaXF1ZSIsIndoZXJlIiwidmFsaWQiLCJfIiwiaWQiLCJTdHJpbmciLCJyb2xlIiwiZXJyIiwiY29uc29sZSIsImVycm9yIiwiY2FsbGJhY2tzIiwiand0IiwidG9rZW4iLCJkZWJ1ZyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./lib/auth.ts\n");

/***/ }),

/***/ "(rsc)/./lib/prisma.ts":
/*!***********************!*\
  !*** ./lib/prisma.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   prisma: () => (/* binding */ prisma)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n\nconst globalForPrisma = globalThis;\nconst prisma = globalForPrisma.prisma || new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient({\n    log:  true ? [\n        \"query\",\n        \"error\",\n        \"warn\"\n    ] : 0\n});\nif (true) globalForPrisma.prisma = prisma;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvcHJpc21hLnRzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUE4QztBQUU5QyxNQUFNQyxrQkFBa0JDO0FBRWpCLE1BQU1DLFNBQ1hGLGdCQUFnQkUsTUFBTSxJQUN0QixJQUFJSCx3REFBWUEsQ0FBQztJQUNmSSxLQUFLQyxLQUFzQyxHQUFHO1FBQUM7UUFBUztRQUFTO0tBQU8sR0FBRyxDQUFTO0FBQ3RGLEdBQUc7QUFFTCxJQUFJQSxJQUFxQyxFQUFFSixnQkFBZ0JFLE1BQU0sR0FBR0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zYWFzX3Jlc3RhdXJhbnQvLi9saWIvcHJpc21hLnRzPzk4MjIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUHJpc21hQ2xpZW50IH0gZnJvbSBcIkBwcmlzbWEvY2xpZW50XCI7XG5cbmNvbnN0IGdsb2JhbEZvclByaXNtYSA9IGdsb2JhbFRoaXMgYXMgdW5rbm93biBhcyB7IHByaXNtYTogUHJpc21hQ2xpZW50IH07XG5cbmV4cG9ydCBjb25zdCBwcmlzbWEgPVxuICBnbG9iYWxGb3JQcmlzbWEucHJpc21hIHx8XG4gIG5ldyBQcmlzbWFDbGllbnQoe1xuICAgIGxvZzogcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwiZGV2ZWxvcG1lbnRcIiA/IFtcInF1ZXJ5XCIsIFwiZXJyb3JcIiwgXCJ3YXJuXCJdIDogW1wiZXJyb3JcIl0sXG4gIH0pO1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSBnbG9iYWxGb3JQcmlzbWEucHJpc21hID0gcHJpc21hO1xuIl0sIm5hbWVzIjpbIlByaXNtYUNsaWVudCIsImdsb2JhbEZvclByaXNtYSIsImdsb2JhbFRoaXMiLCJwcmlzbWEiLCJsb2ciLCJwcm9jZXNzIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./lib/prisma.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/next-auth","vendor-chunks/@babel","vendor-chunks/jose","vendor-chunks/openid-client","vendor-chunks/bcryptjs","vendor-chunks/oauth","vendor-chunks/object-hash","vendor-chunks/preact","vendor-chunks/uuid","vendor-chunks/yallist","vendor-chunks/preact-render-to-string","vendor-chunks/lru-cache","vendor-chunks/cookie","vendor-chunks/oidc-token-hash","vendor-chunks/@panva","vendor-chunks/zod"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fmenu%2F%5Bid%5D%2Froute&page=%2Fapi%2Fmenu%2F%5Bid%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fmenu%2F%5Bid%5D%2Froute.ts&appDir=C%3A%5CUsers%5CMSI1%5CDesktop%5Csaas_restaurant%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CMSI1%5CDesktop%5Csaas_restaurant&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();