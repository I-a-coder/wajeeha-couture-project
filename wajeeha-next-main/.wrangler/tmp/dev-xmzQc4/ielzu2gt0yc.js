var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// .wrangler/tmp/bundle-tI0Suc/checked-fetch.js
var urls = /* @__PURE__ */ new Set();
function checkURL(request, init) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls.has(url.toString())) {
      urls.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
__name(checkURL, "checkURL");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    const [request, init] = argArray;
    checkURL(request, init);
    return Reflect.apply(target, thisArg, argArray);
  }
});

// .wrangler/tmp/pages-oQFXD7/bundledWorker-0.658754429323452.mjs
var __defProp2 = Object.defineProperty;
var __name2 = /* @__PURE__ */ __name((target, value) => __defProp2(target, "name", { value, configurable: true }), "__name");
import("node:buffer").then(({ Buffer: Buffer2 }) => {
  globalThis.Buffer = Buffer2;
}).catch(() => null);
var __ALSes_PROMISE__ = import("node:async_hooks").then(({ AsyncLocalStorage }) => {
  globalThis.AsyncLocalStorage = AsyncLocalStorage;
  const envAsyncLocalStorage = new AsyncLocalStorage();
  const requestContextAsyncLocalStorage = new AsyncLocalStorage();
  globalThis.process = {
    env: new Proxy(
      {},
      {
        ownKeys: () => Reflect.ownKeys(envAsyncLocalStorage.getStore()),
        getOwnPropertyDescriptor: (_2, ...args) => Reflect.getOwnPropertyDescriptor(envAsyncLocalStorage.getStore(), ...args),
        get: (_2, property) => Reflect.get(envAsyncLocalStorage.getStore(), property),
        set: (_2, property, value) => Reflect.set(envAsyncLocalStorage.getStore(), property, value)
      }
    )
  };
  globalThis[Symbol.for("__cloudflare-request-context__")] = new Proxy(
    {},
    {
      ownKeys: () => Reflect.ownKeys(requestContextAsyncLocalStorage.getStore()),
      getOwnPropertyDescriptor: (_2, ...args) => Reflect.getOwnPropertyDescriptor(requestContextAsyncLocalStorage.getStore(), ...args),
      get: (_2, property) => Reflect.get(requestContextAsyncLocalStorage.getStore(), property),
      set: (_2, property, value) => Reflect.set(requestContextAsyncLocalStorage.getStore(), property, value)
    }
  );
  return { envAsyncLocalStorage, requestContextAsyncLocalStorage };
}).catch(() => null);
var ae = Object.create;
var q = Object.defineProperty;
var se = Object.getOwnPropertyDescriptor;
var re = Object.getOwnPropertyNames;
var ne = Object.getPrototypeOf;
var ie = Object.prototype.hasOwnProperty;
var j = /* @__PURE__ */ __name2((e, t) => () => (e && (t = e(e = 0)), t), "j");
var H = /* @__PURE__ */ __name2((e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports), "H");
var oe = /* @__PURE__ */ __name2((e, t, s, a) => {
  if (t && typeof t == "object" || typeof t == "function")
    for (let n of re(t))
      !ie.call(e, n) && n !== s && q(e, n, { get: () => t[n], enumerable: !(a = se(t, n)) || a.enumerable });
  return e;
}, "oe");
var U = /* @__PURE__ */ __name2((e, t, s) => (s = e != null ? ae(ne(e)) : {}, oe(t || !e || !e.__esModule ? q(s, "default", { value: e, enumerable: true }) : s, e)), "U");
var y;
var l = j(() => {
  y = { collectedLocales: [] };
});
var _;
var u = j(() => {
  _ = { version: 3, routes: { none: [{ src: "^(?:/((?:[^/]+?)(?:/(?:[^/]+?))*))/$", headers: { Location: "/$1" }, status: 308, continue: true }, { src: "^/_next/__private/trace$", dest: "/404", status: 404, continue: true }, { src: "^/404/?$", status: 404, continue: true, missing: [{ type: "header", key: "x-prerender-revalidate" }] }, { src: "^/500$", status: 500, continue: true }, { src: "^/?$", has: [{ type: "header", key: "rsc" }], dest: "/index.rsc", headers: { vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch" }, continue: true, override: true }, { src: "^/((?!.+\\.rsc).+?)(?:/)?$", has: [{ type: "header", key: "rsc" }], dest: "/$1.rsc", headers: { vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch" }, continue: true, override: true }], filesystem: [{ src: "^/index(\\.action|\\.rsc)$", dest: "/", continue: true }, { src: "^/_next/data/(.*)$", dest: "/_next/data/$1", check: true }, { src: "^/\\.prefetch\\.rsc$", dest: "/__index.prefetch.rsc", check: true }, { src: "^/(.+)/\\.prefetch\\.rsc$", dest: "/$1.prefetch.rsc", check: true }, { src: "^/\\.rsc$", dest: "/index.rsc", check: true }, { src: "^/(.+)/\\.rsc$", dest: "/$1.rsc", check: true }], miss: [{ src: "^/_next/static/(?:[^/]+/pages|pages|chunks|runtime|css|image|media)/.+$", status: 404, check: true, dest: "$0" }], rewrite: [{ src: "^/_next/data/(.*)$", dest: "/404", status: 404 }, { src: "^/accessories/(?<nxtPid>[^/]+?)(?:\\.rsc)(?:/)?$", dest: "/accessories/[id].rsc?nxtPid=$nxtPid" }, { src: "^/accessories/(?<nxtPid>[^/]+?)(?:/)?$", dest: "/accessories/[id]?nxtPid=$nxtPid" }, { src: "^/collections/(?<nxtPid>[^/]+?)(?:\\.rsc)(?:/)?$", dest: "/collections/[id].rsc?nxtPid=$nxtPid" }, { src: "^/collections/(?<nxtPid>[^/]+?)(?:/)?$", dest: "/collections/[id]?nxtPid=$nxtPid" }, { src: "^/(?<nxtPcollection>[^/]+?)/(?<nxtPid>[^/]+?)(?:\\.rsc)(?:/)?$", dest: "/[collection]/[id].rsc?nxtPcollection=$nxtPcollection&nxtPid=$nxtPid" }, { src: "^/(?<nxtPcollection>[^/]+?)/(?<nxtPid>[^/]+?)(?:/)?$", dest: "/[collection]/[id]?nxtPcollection=$nxtPcollection&nxtPid=$nxtPid" }], resource: [{ src: "^/.*$", status: 404 }], hit: [{ src: "^/_next/static/(?:[^/]+/pages|pages|chunks|runtime|css|image|media|JdNd\\-w6_s6wY83oyWRSek)/.+$", headers: { "cache-control": "public,max-age=31536000,immutable" }, continue: true, important: true }, { src: "^/index(?:/)?$", headers: { "x-matched-path": "/" }, continue: true, important: true }, { src: "^/((?!index$).*?)(?:/)?$", headers: { "x-matched-path": "/$1" }, continue: true, important: true }], error: [{ src: "^/.*$", dest: "/404", status: 404 }, { src: "^/.*$", dest: "/500", status: 500 }] }, images: { domains: [], sizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840, 16, 32, 48, 64, 96, 128, 256, 384], remotePatterns: [{ protocol: "https", hostname: "^(?:^(?:static\\.wajeehacouture\\.com)$)$", port: "", pathname: "^(?:\\/assets(?:\\/(?!\\.{1,2}(?:\\/|$))(?:(?:(?!(?:^|\\/)\\.{1,2}(?:\\/|$)).)*?)|$))$" }], minimumCacheTTL: 60, formats: ["image/webp"], dangerouslyAllowSVG: false, contentSecurityPolicy: "script-src 'none'; frame-src 'none'; sandbox;", contentDispositionType: "inline" }, overrides: { "404.html": { path: "404", contentType: "text/html; charset=utf-8" }, "500.html": { path: "500", contentType: "text/html; charset=utf-8" }, "_app.rsc.json": { path: "_app.rsc", contentType: "application/json" }, "_error.rsc.json": { path: "_error.rsc", contentType: "application/json" }, "_document.rsc.json": { path: "_document.rsc", contentType: "application/json" }, "api/allCollectionsApi.rsc.json": { path: "api/allCollectionsApi.rsc", contentType: "application/json" }, "api/footerApi.rsc.json": { path: "api/footerApi.rsc", contentType: "application/json" }, "api/allProductApi.rsc.json": { path: "api/allProductApi.rsc", contentType: "application/json" }, "api/clearanceSaleApi.rsc.json": { path: "api/clearanceSaleApi.rsc", contentType: "application/json" }, "api/homeApi.rsc.json": { path: "api/homeApi.rsc", contentType: "application/json" }, "api/newArrivalApi.rsc.json": { path: "api/newArrivalApi.rsc", contentType: "application/json" }, "api/headerApi.rsc.json": { path: "api/headerApi.rsc", contentType: "application/json" }, "404.rsc.json": { path: "404.rsc", contentType: "application/json" } }, framework: { version: "14.2.13" }, crons: [] };
});
var f;
var p = j(() => {
  f = { "/404.html": { type: "override", path: "/404.html", headers: { "content-type": "text/html; charset=utf-8" } }, "/404.rsc.json": { type: "override", path: "/404.rsc.json", headers: { "content-type": "application/json" } }, "/500.html": { type: "override", path: "/500.html", headers: { "content-type": "text/html; charset=utf-8" } }, "/_app.rsc.json": { type: "override", path: "/_app.rsc.json", headers: { "content-type": "application/json" } }, "/_document.rsc.json": { type: "override", path: "/_document.rsc.json", headers: { "content-type": "application/json" } }, "/_error.rsc.json": { type: "override", path: "/_error.rsc.json", headers: { "content-type": "application/json" } }, "/_next/static/JdNd-w6_s6wY83oyWRSek/_buildManifest.js": { type: "static" }, "/_next/static/JdNd-w6_s6wY83oyWRSek/_ssgManifest.js": { type: "static" }, "/_next/static/chunks/318-60d2631d2e0e6ecf.js": { type: "static" }, "/_next/static/chunks/526-048014a977e23e55.js": { type: "static" }, "/_next/static/chunks/53c13509-b98f635dffe06ca9.js": { type: "static" }, "/_next/static/chunks/662-b5e391d8db27aebe.js": { type: "static" }, "/_next/static/chunks/94730671-1cf6263ab1d616d1.js": { type: "static" }, "/_next/static/chunks/app/[collection]/[id]/page-ce395461b8d82879.js": { type: "static" }, "/_next/static/chunks/app/_not-found/page-9c39c369fb2c27d7.js": { type: "static" }, "/_next/static/chunks/app/accessories/[id]/page-20dd92906010df48.js": { type: "static" }, "/_next/static/chunks/app/accessories/page-7295971a18ec84d9.js": { type: "static" }, "/_next/static/chunks/app/cart/page-4b71da85380c203e.js": { type: "static" }, "/_next/static/chunks/app/clearance-sale/page-55a8ea125312791d.js": { type: "static" }, "/_next/static/chunks/app/collections/[id]/page-88e36db45add7ee5.js": { type: "static" }, "/_next/static/chunks/app/collections/page-395c8f005fa48125.js": { type: "static" }, "/_next/static/chunks/app/contact/page-a3315423b28f9a6d.js": { type: "static" }, "/_next/static/chunks/app/faqs/page-68e605476ecea3fa.js": { type: "static" }, "/_next/static/chunks/app/layout-8a227a7c342373ba.js": { type: "static" }, "/_next/static/chunks/app/login/page-1e50a82103a0eb7f.js": { type: "static" }, "/_next/static/chunks/app/new-arrivals/page-6dc0c4b80de3c1fc.js": { type: "static" }, "/_next/static/chunks/app/our-journey/page-eabda923dd90e6d5.js": { type: "static" }, "/_next/static/chunks/app/page-232067c98f7f3d4b.js": { type: "static" }, "/_next/static/chunks/app/privacy-policy/page-269074ee2eb0cbeb.js": { type: "static" }, "/_next/static/chunks/app/return-exchange/page-ddabadf89db2496f.js": { type: "static" }, "/_next/static/chunks/app/signup/page-20b7bf997708e4c3.js": { type: "static" }, "/_next/static/chunks/app/size-guide/page-51556921e6d3ce16.js": { type: "static" }, "/_next/static/chunks/fd9d1056-2737f78bfff3f6bf.js": { type: "static" }, "/_next/static/chunks/framework-f66176bb897dc684.js": { type: "static" }, "/_next/static/chunks/main-970626056fb40363.js": { type: "static" }, "/_next/static/chunks/main-app-ecc756b22ce8d827.js": { type: "static" }, "/_next/static/chunks/pages/_app-6a626577ffa902a4.js": { type: "static" }, "/_next/static/chunks/pages/_error-1be831200e60c5c0.js": { type: "static" }, "/_next/static/chunks/polyfills-42372ed130431b0a.js": { type: "static" }, "/_next/static/chunks/webpack-e73a3788cd84dc7a.js": { type: "static" }, "/_next/static/css/144728e6fa0b453b.css": { type: "static" }, "/_next/static/css/3a24c022f69a36a9.css": { type: "static" }, "/_next/static/media/4473ecc91f70f139-s.p.woff": { type: "static" }, "/_next/static/media/ajax-loader.0b80f665.gif": { type: "static" }, "/_next/static/media/slick.25572f22.eot": { type: "static" }, "/_next/static/media/slick.653a4cbb.woff": { type: "static" }, "/_next/static/media/slick.6aa1ee46.ttf": { type: "static" }, "/_next/static/media/slick.f895cfdf.svg": { type: "static" }, "/api/allCollectionsApi.rsc.json": { type: "override", path: "/api/allCollectionsApi.rsc.json", headers: { "content-type": "application/json" } }, "/api/allProductApi.rsc.json": { type: "override", path: "/api/allProductApi.rsc.json", headers: { "content-type": "application/json" } }, "/api/clearanceSaleApi.rsc.json": { type: "override", path: "/api/clearanceSaleApi.rsc.json", headers: { "content-type": "application/json" } }, "/api/footerApi.rsc.json": { type: "override", path: "/api/footerApi.rsc.json", headers: { "content-type": "application/json" } }, "/api/headerApi.rsc.json": { type: "override", path: "/api/headerApi.rsc.json", headers: { "content-type": "application/json" } }, "/api/homeApi.rsc.json": { type: "override", path: "/api/homeApi.rsc.json", headers: { "content-type": "application/json" } }, "/api/newArrivalApi.rsc.json": { type: "override", path: "/api/newArrivalApi.rsc.json", headers: { "content-type": "application/json" } }, "/assets/Logo.svg": { type: "static" }, "/favicon.ico": { type: "static" }, "/[collection]/[id]": { type: "function", entrypoint: "__next-on-pages-dist__/functions/[collection]/[id].func.js" }, "/[collection]/[id].rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/[collection]/[id].func.js" }, "/accessories/[id]": { type: "function", entrypoint: "__next-on-pages-dist__/functions/accessories/[id].func.js" }, "/accessories/[id].rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/accessories/[id].func.js" }, "/api/allCollectionsApi": { type: "function", entrypoint: "__next-on-pages-dist__/functions/api/allCollectionsApi.func.js" }, "/api/allProductApi": { type: "function", entrypoint: "__next-on-pages-dist__/functions/api/allProductApi.func.js" }, "/api/clearanceSaleApi": { type: "function", entrypoint: "__next-on-pages-dist__/functions/api/clearanceSaleApi.func.js" }, "/api/footerApi": { type: "function", entrypoint: "__next-on-pages-dist__/functions/api/footerApi.func.js" }, "/api/headerApi": { type: "function", entrypoint: "__next-on-pages-dist__/functions/api/headerApi.func.js" }, "/api/homeApi": { type: "function", entrypoint: "__next-on-pages-dist__/functions/api/homeApi.func.js" }, "/api/newArrivalApi": { type: "function", entrypoint: "__next-on-pages-dist__/functions/api/newArrivalApi.func.js" }, "/collections/[id]": { type: "function", entrypoint: "__next-on-pages-dist__/functions/collections/[id].func.js" }, "/collections/[id].rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/collections/[id].func.js" }, "/404": { type: "override", path: "/404.html", headers: { "content-type": "text/html; charset=utf-8" } }, "/500": { type: "override", path: "/500.html", headers: { "content-type": "text/html; charset=utf-8" } }, "/_app.rsc": { type: "override", path: "/_app.rsc.json", headers: { "content-type": "application/json" } }, "/_error.rsc": { type: "override", path: "/_error.rsc.json", headers: { "content-type": "application/json" } }, "/_document.rsc": { type: "override", path: "/_document.rsc.json", headers: { "content-type": "application/json" } }, "/api/allCollectionsApi.rsc": { type: "override", path: "/api/allCollectionsApi.rsc.json", headers: { "content-type": "application/json" } }, "/api/footerApi.rsc": { type: "override", path: "/api/footerApi.rsc.json", headers: { "content-type": "application/json" } }, "/api/allProductApi.rsc": { type: "override", path: "/api/allProductApi.rsc.json", headers: { "content-type": "application/json" } }, "/api/clearanceSaleApi.rsc": { type: "override", path: "/api/clearanceSaleApi.rsc.json", headers: { "content-type": "application/json" } }, "/api/homeApi.rsc": { type: "override", path: "/api/homeApi.rsc.json", headers: { "content-type": "application/json" } }, "/api/newArrivalApi.rsc": { type: "override", path: "/api/newArrivalApi.rsc.json", headers: { "content-type": "application/json" } }, "/api/headerApi.rsc": { type: "override", path: "/api/headerApi.rsc.json", headers: { "content-type": "application/json" } }, "/404.rsc": { type: "override", path: "/404.rsc.json", headers: { "content-type": "application/json" } }, "/accessories.html": { type: "override", path: "/accessories.html", headers: { "x-next-cache-tags": "_N_T_/layout,_N_T_/accessories/layout,_N_T_/accessories/page,_N_T_/accessories", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch" } }, "/accessories": { type: "override", path: "/accessories.html", headers: { "x-next-cache-tags": "_N_T_/layout,_N_T_/accessories/layout,_N_T_/accessories/page,_N_T_/accessories", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch" } }, "/accessories.rsc": { type: "override", path: "/accessories.rsc", headers: { "x-next-cache-tags": "_N_T_/layout,_N_T_/accessories/layout,_N_T_/accessories/page,_N_T_/accessories", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch", "content-type": "text/x-component" } }, "/cart.html": { type: "override", path: "/cart.html", headers: { "x-next-cache-tags": "_N_T_/layout,_N_T_/cart/layout,_N_T_/cart/page,_N_T_/cart", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch" } }, "/cart": { type: "override", path: "/cart.html", headers: { "x-next-cache-tags": "_N_T_/layout,_N_T_/cart/layout,_N_T_/cart/page,_N_T_/cart", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch" } }, "/cart.rsc": { type: "override", path: "/cart.rsc", headers: { "x-next-cache-tags": "_N_T_/layout,_N_T_/cart/layout,_N_T_/cart/page,_N_T_/cart", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch", "content-type": "text/x-component" } }, "/clearance-sale.html": { type: "override", path: "/clearance-sale.html", headers: { "x-next-cache-tags": "_N_T_/layout,_N_T_/clearance-sale/layout,_N_T_/clearance-sale/page,_N_T_/clearance-sale", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch" } }, "/clearance-sale": { type: "override", path: "/clearance-sale.html", headers: { "x-next-cache-tags": "_N_T_/layout,_N_T_/clearance-sale/layout,_N_T_/clearance-sale/page,_N_T_/clearance-sale", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch" } }, "/clearance-sale.rsc": { type: "override", path: "/clearance-sale.rsc", headers: { "x-next-cache-tags": "_N_T_/layout,_N_T_/clearance-sale/layout,_N_T_/clearance-sale/page,_N_T_/clearance-sale", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch", "content-type": "text/x-component" } }, "/collections.html": { type: "override", path: "/collections.html", headers: { "x-next-cache-tags": "_N_T_/layout,_N_T_/collections/layout,_N_T_/collections/page,_N_T_/collections", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch" } }, "/collections": { type: "override", path: "/collections.html", headers: { "x-next-cache-tags": "_N_T_/layout,_N_T_/collections/layout,_N_T_/collections/page,_N_T_/collections", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch" } }, "/collections.rsc": { type: "override", path: "/collections.rsc", headers: { "x-next-cache-tags": "_N_T_/layout,_N_T_/collections/layout,_N_T_/collections/page,_N_T_/collections", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch", "content-type": "text/x-component" } }, "/contact.html": { type: "override", path: "/contact.html", headers: { "x-next-cache-tags": "_N_T_/layout,_N_T_/contact/layout,_N_T_/contact/page,_N_T_/contact", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch" } }, "/contact": { type: "override", path: "/contact.html", headers: { "x-next-cache-tags": "_N_T_/layout,_N_T_/contact/layout,_N_T_/contact/page,_N_T_/contact", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch" } }, "/contact.rsc": { type: "override", path: "/contact.rsc", headers: { "x-next-cache-tags": "_N_T_/layout,_N_T_/contact/layout,_N_T_/contact/page,_N_T_/contact", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch", "content-type": "text/x-component" } }, "/faqs.html": { type: "override", path: "/faqs.html", headers: { "x-next-cache-tags": "_N_T_/layout,_N_T_/faqs/layout,_N_T_/faqs/page,_N_T_/faqs", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch" } }, "/faqs": { type: "override", path: "/faqs.html", headers: { "x-next-cache-tags": "_N_T_/layout,_N_T_/faqs/layout,_N_T_/faqs/page,_N_T_/faqs", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch" } }, "/faqs.rsc": { type: "override", path: "/faqs.rsc", headers: { "x-next-cache-tags": "_N_T_/layout,_N_T_/faqs/layout,_N_T_/faqs/page,_N_T_/faqs", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch", "content-type": "text/x-component" } }, "/index.html": { type: "override", path: "/index.html", headers: { "x-next-cache-tags": "_N_T_/layout,_N_T_/page,_N_T_/", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch" } }, "/index": { type: "override", path: "/index.html", headers: { "x-next-cache-tags": "_N_T_/layout,_N_T_/page,_N_T_/", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch" } }, "/": { type: "override", path: "/index.html", headers: { "x-next-cache-tags": "_N_T_/layout,_N_T_/page,_N_T_/", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch" } }, "/index.rsc": { type: "override", path: "/index.rsc", headers: { "x-next-cache-tags": "_N_T_/layout,_N_T_/page,_N_T_/", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch", "content-type": "text/x-component" } }, "/login.html": { type: "override", path: "/login.html", headers: { "x-next-cache-tags": "_N_T_/layout,_N_T_/login/layout,_N_T_/login/page,_N_T_/login", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch" } }, "/login": { type: "override", path: "/login.html", headers: { "x-next-cache-tags": "_N_T_/layout,_N_T_/login/layout,_N_T_/login/page,_N_T_/login", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch" } }, "/login.rsc": { type: "override", path: "/login.rsc", headers: { "x-next-cache-tags": "_N_T_/layout,_N_T_/login/layout,_N_T_/login/page,_N_T_/login", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch", "content-type": "text/x-component" } }, "/new-arrivals.html": { type: "override", path: "/new-arrivals.html", headers: { "x-next-cache-tags": "_N_T_/layout,_N_T_/new-arrivals/layout,_N_T_/new-arrivals/page,_N_T_/new-arrivals", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch" } }, "/new-arrivals": { type: "override", path: "/new-arrivals.html", headers: { "x-next-cache-tags": "_N_T_/layout,_N_T_/new-arrivals/layout,_N_T_/new-arrivals/page,_N_T_/new-arrivals", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch" } }, "/new-arrivals.rsc": { type: "override", path: "/new-arrivals.rsc", headers: { "x-next-cache-tags": "_N_T_/layout,_N_T_/new-arrivals/layout,_N_T_/new-arrivals/page,_N_T_/new-arrivals", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch", "content-type": "text/x-component" } }, "/our-journey.html": { type: "override", path: "/our-journey.html", headers: { "x-next-cache-tags": "_N_T_/layout,_N_T_/our-journey/layout,_N_T_/our-journey/page,_N_T_/our-journey", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch" } }, "/our-journey": { type: "override", path: "/our-journey.html", headers: { "x-next-cache-tags": "_N_T_/layout,_N_T_/our-journey/layout,_N_T_/our-journey/page,_N_T_/our-journey", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch" } }, "/our-journey.rsc": { type: "override", path: "/our-journey.rsc", headers: { "x-next-cache-tags": "_N_T_/layout,_N_T_/our-journey/layout,_N_T_/our-journey/page,_N_T_/our-journey", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch", "content-type": "text/x-component" } }, "/privacy-policy.html": { type: "override", path: "/privacy-policy.html", headers: { "x-next-cache-tags": "_N_T_/layout,_N_T_/privacy-policy/layout,_N_T_/privacy-policy/page,_N_T_/privacy-policy", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch" } }, "/privacy-policy": { type: "override", path: "/privacy-policy.html", headers: { "x-next-cache-tags": "_N_T_/layout,_N_T_/privacy-policy/layout,_N_T_/privacy-policy/page,_N_T_/privacy-policy", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch" } }, "/privacy-policy.rsc": { type: "override", path: "/privacy-policy.rsc", headers: { "x-next-cache-tags": "_N_T_/layout,_N_T_/privacy-policy/layout,_N_T_/privacy-policy/page,_N_T_/privacy-policy", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch", "content-type": "text/x-component" } }, "/return-exchange.html": { type: "override", path: "/return-exchange.html", headers: { "x-next-cache-tags": "_N_T_/layout,_N_T_/return-exchange/layout,_N_T_/return-exchange/page,_N_T_/return-exchange", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch" } }, "/return-exchange": { type: "override", path: "/return-exchange.html", headers: { "x-next-cache-tags": "_N_T_/layout,_N_T_/return-exchange/layout,_N_T_/return-exchange/page,_N_T_/return-exchange", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch" } }, "/return-exchange.rsc": { type: "override", path: "/return-exchange.rsc", headers: { "x-next-cache-tags": "_N_T_/layout,_N_T_/return-exchange/layout,_N_T_/return-exchange/page,_N_T_/return-exchange", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch", "content-type": "text/x-component" } }, "/signup.html": { type: "override", path: "/signup.html", headers: { "x-next-cache-tags": "_N_T_/layout,_N_T_/signup/layout,_N_T_/signup/page,_N_T_/signup", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch" } }, "/signup": { type: "override", path: "/signup.html", headers: { "x-next-cache-tags": "_N_T_/layout,_N_T_/signup/layout,_N_T_/signup/page,_N_T_/signup", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch" } }, "/signup.rsc": { type: "override", path: "/signup.rsc", headers: { "x-next-cache-tags": "_N_T_/layout,_N_T_/signup/layout,_N_T_/signup/page,_N_T_/signup", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch", "content-type": "text/x-component" } }, "/size-guide.html": { type: "override", path: "/size-guide.html", headers: { "x-next-cache-tags": "_N_T_/layout,_N_T_/size-guide/layout,_N_T_/size-guide/page,_N_T_/size-guide", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch" } }, "/size-guide": { type: "override", path: "/size-guide.html", headers: { "x-next-cache-tags": "_N_T_/layout,_N_T_/size-guide/layout,_N_T_/size-guide/page,_N_T_/size-guide", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch" } }, "/size-guide.rsc": { type: "override", path: "/size-guide.rsc", headers: { "x-next-cache-tags": "_N_T_/layout,_N_T_/size-guide/layout,_N_T_/size-guide/page,_N_T_/size-guide", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch", "content-type": "text/x-component" } } };
});
var $ = H((Be, V) => {
  "use strict";
  l();
  u();
  p();
  function R(e, t) {
    e = String(e || "").trim();
    let s = e, a, n = "";
    if (/^[^a-zA-Z\\\s]/.test(e)) {
      a = e[0];
      let o = e.lastIndexOf(a);
      n += e.substring(o + 1), e = e.substring(1, o);
    }
    let r = 0;
    return e = ue(e, (o) => {
      if (/^\(\?[P<']/.test(o)) {
        let c = /^\(\?P?[<']([^>']+)[>']/.exec(o);
        if (!c)
          throw new Error(`Failed to extract named captures from ${JSON.stringify(o)}`);
        let h = o.substring(c[0].length, o.length - 1);
        return t && (t[r] = c[1]), r++, `(${h})`;
      }
      return o.substring(0, 3) === "(?:" || r++, o;
    }), e = e.replace(/\[:([^:]+):\]/g, (o, c) => R.characterClasses[c] || o), new R.PCRE(e, n, s, n, a);
  }
  __name(R, "R");
  __name2(R, "R");
  function ue(e, t) {
    let s = 0, a = 0, n = false;
    for (let i = 0; i < e.length; i++) {
      let r = e[i];
      if (n) {
        n = false;
        continue;
      }
      switch (r) {
        case "(":
          a === 0 && (s = i), a++;
          break;
        case ")":
          if (a > 0 && (a--, a === 0)) {
            let o = i + 1, c = s === 0 ? "" : e.substring(0, s), h = e.substring(o), d = String(t(e.substring(s, o)));
            e = c + d + h, i = s;
          }
          break;
        case "\\":
          n = true;
          break;
        default:
          break;
      }
    }
    return e;
  }
  __name(ue, "ue");
  __name2(ue, "ue");
  (function(e) {
    class t extends RegExp {
      constructor(a, n, i, r, o) {
        super(a, n), this.pcrePattern = i, this.pcreFlags = r, this.delimiter = o;
      }
    }
    __name(t, "t");
    __name2(t, "t");
    e.PCRE = t, e.characterClasses = { alnum: "[A-Za-z0-9]", word: "[A-Za-z0-9_]", alpha: "[A-Za-z]", blank: "[ \\t]", cntrl: "[\\x00-\\x1F\\x7F]", digit: "\\d", graph: "[\\x21-\\x7E]", lower: "[a-z]", print: "[\\x20-\\x7E]", punct: "[\\]\\[!\"#$%&'()*+,./:;<=>?@\\\\^_`{|}~-]", space: "\\s", upper: "[A-Z]", xdigit: "[A-Fa-f0-9]" };
  })(R || (R = {}));
  R.prototype = R.PCRE.prototype;
  V.exports = R;
});
var X = H((O) => {
  "use strict";
  l();
  u();
  p();
  O.parse = ve;
  O.serialize = Te;
  var Ne = Object.prototype.toString, C = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
  function ve(e, t) {
    if (typeof e != "string")
      throw new TypeError("argument str must be a string");
    for (var s = {}, a = t || {}, n = a.decode || we, i = 0; i < e.length; ) {
      var r = e.indexOf("=", i);
      if (r === -1)
        break;
      var o = e.indexOf(";", i);
      if (o === -1)
        o = e.length;
      else if (o < r) {
        i = e.lastIndexOf(";", r - 1) + 1;
        continue;
      }
      var c = e.slice(i, r).trim();
      if (s[c] === void 0) {
        var h = e.slice(r + 1, o).trim();
        h.charCodeAt(0) === 34 && (h = h.slice(1, -1)), s[c] = be(h, n);
      }
      i = o + 1;
    }
    return s;
  }
  __name(ve, "ve");
  __name2(ve, "ve");
  function Te(e, t, s) {
    var a = s || {}, n = a.encode || Se;
    if (typeof n != "function")
      throw new TypeError("option encode is invalid");
    if (!C.test(e))
      throw new TypeError("argument name is invalid");
    var i = n(t);
    if (i && !C.test(i))
      throw new TypeError("argument val is invalid");
    var r = e + "=" + i;
    if (a.maxAge != null) {
      var o = a.maxAge - 0;
      if (isNaN(o) || !isFinite(o))
        throw new TypeError("option maxAge is invalid");
      r += "; Max-Age=" + Math.floor(o);
    }
    if (a.domain) {
      if (!C.test(a.domain))
        throw new TypeError("option domain is invalid");
      r += "; Domain=" + a.domain;
    }
    if (a.path) {
      if (!C.test(a.path))
        throw new TypeError("option path is invalid");
      r += "; Path=" + a.path;
    }
    if (a.expires) {
      var c = a.expires;
      if (!Pe(c) || isNaN(c.valueOf()))
        throw new TypeError("option expires is invalid");
      r += "; Expires=" + c.toUTCString();
    }
    if (a.httpOnly && (r += "; HttpOnly"), a.secure && (r += "; Secure"), a.priority) {
      var h = typeof a.priority == "string" ? a.priority.toLowerCase() : a.priority;
      switch (h) {
        case "low":
          r += "; Priority=Low";
          break;
        case "medium":
          r += "; Priority=Medium";
          break;
        case "high":
          r += "; Priority=High";
          break;
        default:
          throw new TypeError("option priority is invalid");
      }
    }
    if (a.sameSite) {
      var d = typeof a.sameSite == "string" ? a.sameSite.toLowerCase() : a.sameSite;
      switch (d) {
        case true:
          r += "; SameSite=Strict";
          break;
        case "lax":
          r += "; SameSite=Lax";
          break;
        case "strict":
          r += "; SameSite=Strict";
          break;
        case "none":
          r += "; SameSite=None";
          break;
        default:
          throw new TypeError("option sameSite is invalid");
      }
    }
    return r;
  }
  __name(Te, "Te");
  __name2(Te, "Te");
  function we(e) {
    return e.indexOf("%") !== -1 ? decodeURIComponent(e) : e;
  }
  __name(we, "we");
  __name2(we, "we");
  function Se(e) {
    return encodeURIComponent(e);
  }
  __name(Se, "Se");
  __name2(Se, "Se");
  function Pe(e) {
    return Ne.call(e) === "[object Date]" || e instanceof Date;
  }
  __name(Pe, "Pe");
  __name2(Pe, "Pe");
  function be(e, t) {
    try {
      return t(e);
    } catch {
      return e;
    }
  }
  __name(be, "be");
  __name2(be, "be");
});
l();
u();
p();
l();
u();
p();
l();
u();
p();
var v = "INTERNAL_SUSPENSE_CACHE_HOSTNAME.local";
l();
u();
p();
l();
u();
p();
l();
u();
p();
l();
u();
p();
var F = U($());
function P(e, t, s) {
  if (t == null)
    return { match: null, captureGroupKeys: [] };
  let a = s ? "" : "i", n = [];
  return { match: (0, F.default)(`%${e}%${a}`, n).exec(t), captureGroupKeys: n };
}
__name(P, "P");
__name2(P, "P");
function T(e, t, s, { namedOnly: a } = {}) {
  return e.replace(/\$([a-zA-Z0-9_]+)/g, (n, i) => {
    let r = s.indexOf(i);
    return a && r === -1 ? n : (r === -1 ? t[parseInt(i, 10)] : t[r + 1]) || "";
  });
}
__name(T, "T");
__name2(T, "T");
function A(e, { url: t, cookies: s, headers: a, routeDest: n }) {
  switch (e.type) {
    case "host":
      return { valid: t.hostname === e.value };
    case "header":
      return e.value !== void 0 ? E(e.value, a.get(e.key), n) : { valid: a.has(e.key) };
    case "cookie": {
      let i = s[e.key];
      return i && e.value !== void 0 ? E(e.value, i, n) : { valid: i !== void 0 };
    }
    case "query":
      return e.value !== void 0 ? E(e.value, t.searchParams.get(e.key), n) : { valid: t.searchParams.has(e.key) };
  }
}
__name(A, "A");
__name2(A, "A");
function E(e, t, s) {
  let { match: a, captureGroupKeys: n } = P(e, t);
  return s && a && n.length ? { valid: !!a, newRouteDest: T(s, a, n, { namedOnly: true }) } : { valid: !!a };
}
__name(E, "E");
__name2(E, "E");
l();
u();
p();
function D(e) {
  let t = new Headers(e.headers);
  return e.cf && (t.set("x-vercel-ip-city", encodeURIComponent(e.cf.city)), t.set("x-vercel-ip-country", e.cf.country), t.set("x-vercel-ip-country-region", e.cf.regionCode), t.set("x-vercel-ip-latitude", e.cf.latitude), t.set("x-vercel-ip-longitude", e.cf.longitude)), t.set("x-vercel-sc-host", v), new Request(e, { headers: t });
}
__name(D, "D");
__name2(D, "D");
l();
u();
p();
function x(e, t, s) {
  let a = t instanceof Headers ? t.entries() : Object.entries(t);
  for (let [n, i] of a) {
    let r = n.toLowerCase(), o = s?.match ? T(i, s.match, s.captureGroupKeys) : i;
    r === "set-cookie" ? e.append(r, o) : e.set(r, o);
  }
}
__name(x, "x");
__name2(x, "x");
function w(e) {
  return /^https?:\/\//.test(e);
}
__name(w, "w");
__name2(w, "w");
function m(e, t) {
  for (let [s, a] of t.entries()) {
    let n = /^nxtP(.+)$/.exec(s), i = /^nxtI(.+)$/.exec(s);
    n?.[1] ? (e.set(s, a), e.set(n[1], a)) : i?.[1] ? e.set(i[1], a.replace(/(\(\.+\))+/, "")) : (!e.has(s) || !!a && !e.getAll(s).includes(a)) && e.append(s, a);
  }
}
__name(m, "m");
__name2(m, "m");
function M(e, t) {
  let s = new URL(t, e.url);
  return m(s.searchParams, new URL(e.url).searchParams), s.pathname = s.pathname.replace(/\/index.html$/, "/").replace(/\.html$/, ""), new Request(s, e);
}
__name(M, "M");
__name2(M, "M");
function S(e) {
  return new Response(e.body, e);
}
__name(S, "S");
__name2(S, "S");
function I(e) {
  return e.split(",").map((t) => {
    let [s, a] = t.split(";"), n = parseFloat((a ?? "q=1").replace(/q *= */gi, ""));
    return [s.trim(), isNaN(n) ? 1 : n];
  }).sort((t, s) => s[1] - t[1]).map(([t]) => t === "*" || t === "" ? [] : t).flat();
}
__name(I, "I");
__name2(I, "I");
l();
u();
p();
function L(e) {
  switch (e) {
    case "none":
      return "filesystem";
    case "filesystem":
      return "rewrite";
    case "rewrite":
      return "resource";
    case "resource":
      return "miss";
    default:
      return "miss";
  }
}
__name(L, "L");
__name2(L, "L");
async function b(e, { request: t, assetsFetcher: s, ctx: a }, { path: n, searchParams: i }) {
  let r, o = new URL(t.url);
  m(o.searchParams, i);
  let c = new Request(o, t);
  try {
    switch (e?.type) {
      case "function":
      case "middleware": {
        let h = await import(e.entrypoint);
        try {
          r = await h.default(c, a);
        } catch (d) {
          let g = d;
          throw g.name === "TypeError" && g.message.endsWith("default is not a function") ? new Error(`An error occurred while evaluating the target edge function (${e.entrypoint})`) : d;
        }
        break;
      }
      case "override": {
        r = S(await s.fetch(M(c, e.path ?? n))), e.headers && x(r.headers, e.headers);
        break;
      }
      case "static": {
        r = await s.fetch(M(c, n));
        break;
      }
      default:
        r = new Response("Not Found", { status: 404 });
    }
  } catch (h) {
    return console.error(h), new Response("Internal Server Error", { status: 500 });
  }
  return S(r);
}
__name(b, "b");
__name2(b, "b");
function z(e, t) {
  let s = "^//?(?:", a = ")/(.*)$";
  return !e.startsWith(s) || !e.endsWith(a) ? false : e.slice(s.length, -a.length).split("|").every((i) => t.has(i));
}
__name(z, "z");
__name2(z, "z");
l();
u();
p();
function pe(e, { protocol: t, hostname: s, port: a, pathname: n }) {
  return !(t && e.protocol.replace(/:$/, "") !== t || !new RegExp(s).test(e.hostname) || a && !new RegExp(a).test(e.port) || n && !new RegExp(n).test(e.pathname));
}
__name(pe, "pe");
__name2(pe, "pe");
function he(e, t) {
  if (e.method !== "GET")
    return;
  let { origin: s, searchParams: a } = new URL(e.url), n = a.get("url"), i = Number.parseInt(a.get("w") ?? "", 10), r = Number.parseInt(a.get("q") ?? "75", 10);
  if (!n || Number.isNaN(i) || Number.isNaN(r) || !t?.sizes?.includes(i) || r < 0 || r > 100)
    return;
  let o = new URL(n, s);
  if (o.pathname.endsWith(".svg") && !t?.dangerouslyAllowSVG)
    return;
  let c = n.startsWith("//"), h = n.startsWith("/") && !c;
  if (!h && !t?.domains?.includes(o.hostname) && !t?.remotePatterns?.find((N) => pe(o, N)))
    return;
  let d = e.headers.get("Accept") ?? "", g = t?.formats?.find((N) => d.includes(N))?.replace("image/", "");
  return { isRelative: h, imageUrl: o, options: { width: i, quality: r, format: g } };
}
__name(he, "he");
__name2(he, "he");
function de(e, t, s) {
  let a = new Headers();
  if (s?.contentSecurityPolicy && a.set("Content-Security-Policy", s.contentSecurityPolicy), s?.contentDispositionType) {
    let i = t.pathname.split("/").pop(), r = i ? `${s.contentDispositionType}; filename="${i}"` : s.contentDispositionType;
    a.set("Content-Disposition", r);
  }
  e.headers.has("Cache-Control") || a.set("Cache-Control", `public, max-age=${s?.minimumCacheTTL ?? 60}`);
  let n = S(e);
  return x(n.headers, a), n;
}
__name(de, "de");
__name2(de, "de");
async function B(e, { buildOutput: t, assetsFetcher: s, imagesConfig: a }) {
  let n = he(e, a);
  if (!n)
    return new Response("Invalid image resizing request", { status: 400 });
  let { isRelative: i, imageUrl: r } = n, c = await (i && r.pathname in t ? s.fetch.bind(s) : fetch)(r);
  return de(c, r, a);
}
__name(B, "B");
__name2(B, "B");
l();
u();
p();
l();
u();
p();
var _e = "x-vercel-cache-tags";
var fe = "x-next-cache-soft-tags";
var ye = Symbol.for("__cloudflare-request-context__");
async function K(e) {
  let t = `https://${v}/v1/suspense-cache/`;
  if (!e.url.startsWith(t))
    return null;
  try {
    let s = new URL(e.url), a = await ge();
    if (s.pathname === "/v1/suspense-cache/revalidate") {
      let i = s.searchParams.get("tags")?.split(",") ?? [];
      for (let r of i)
        await a.revalidateTag(r);
      return new Response(null, { status: 200 });
    }
    let n = s.pathname.replace("/v1/suspense-cache/", "");
    if (!n.length)
      return new Response("Invalid cache key", { status: 400 });
    switch (e.method) {
      case "GET": {
        let i = W(e, fe), r = await a.get(n, { softTags: i });
        return r ? new Response(JSON.stringify(r.value), { status: 200, headers: { "Content-Type": "application/json", "x-vercel-cache-state": "fresh", age: `${(Date.now() - (r.lastModified ?? Date.now())) / 1e3}` } }) : new Response(null, { status: 404 });
      }
      case "POST": {
        let i = globalThis[ye], r = /* @__PURE__ */ __name2(async () => {
          let o = await e.json();
          o.data.tags === void 0 && (o.tags ??= W(e, _e) ?? []), await a.set(n, o);
        }, "r");
        return i ? i.ctx.waitUntil(r()) : await r(), new Response(null, { status: 200 });
      }
      default:
        return new Response(null, { status: 405 });
    }
  } catch (s) {
    return console.error(s), new Response("Error handling cache request", { status: 500 });
  }
}
__name(K, "K");
__name2(K, "K");
async function ge() {
  return process.env.__NEXT_ON_PAGES__KV_SUSPENSE_CACHE ? G("kv") : G("cache-api");
}
__name(ge, "ge");
__name2(ge, "ge");
async function G(e) {
  let t = await import(`./__next-on-pages-dist__/cache/${e}.js`);
  return new t.default();
}
__name(G, "G");
__name2(G, "G");
function W(e, t) {
  return e.headers.get(t)?.split(",")?.filter(Boolean);
}
__name(W, "W");
__name2(W, "W");
function Z() {
  globalThis[J] || (xe(), globalThis[J] = true);
}
__name(Z, "Z");
__name2(Z, "Z");
function xe() {
  let e = globalThis.fetch;
  globalThis.fetch = async (...t) => {
    let s = new Request(...t), a = await me(s);
    return a || (a = await K(s), a) ? a : (Re(s), e(s));
  };
}
__name(xe, "xe");
__name2(xe, "xe");
async function me(e) {
  if (e.url.startsWith("blob:"))
    try {
      let s = (await import(`./__next-on-pages-dist__/assets/${new URL(e.url).pathname}.bin`)).default, a = { async arrayBuffer() {
        return s;
      }, get body() {
        return new ReadableStream({ start(n) {
          let i = Buffer.from(s);
          n.enqueue(i), n.close();
        } });
      }, async text() {
        return Buffer.from(s).toString();
      }, async json() {
        let n = Buffer.from(s);
        return JSON.stringify(n.toString());
      }, async blob() {
        return new Blob(s);
      } };
      return a.clone = () => ({ ...a }), a;
    } catch {
    }
  return null;
}
__name(me, "me");
__name2(me, "me");
function Re(e) {
  e.headers.has("user-agent") || e.headers.set("user-agent", "Next.js Middleware");
}
__name(Re, "Re");
__name2(Re, "Re");
var J = Symbol.for("next-on-pages fetch patch");
l();
u();
p();
var Y = U(X());
var k = /* @__PURE__ */ __name2(class {
  constructor(t, s, a, n, i) {
    this.routes = t;
    this.output = s;
    this.reqCtx = a;
    this.url = new URL(a.request.url), this.cookies = (0, Y.parse)(a.request.headers.get("cookie") || ""), this.path = this.url.pathname || "/", this.headers = { normal: new Headers(), important: new Headers() }, this.searchParams = new URLSearchParams(), m(this.searchParams, this.url.searchParams), this.checkPhaseCounter = 0, this.middlewareInvoked = [], this.wildcardMatch = i?.find((r) => r.domain === this.url.hostname), this.locales = new Set(n.collectedLocales);
  }
  url;
  cookies;
  wildcardMatch;
  path;
  status;
  headers;
  searchParams;
  body;
  checkPhaseCounter;
  middlewareInvoked;
  locales;
  checkRouteMatch(t, { checkStatus: s, checkIntercept: a }) {
    let n = P(t.src, this.path, t.caseSensitive);
    if (!n.match || t.methods && !t.methods.map((r) => r.toUpperCase()).includes(this.reqCtx.request.method.toUpperCase()))
      return;
    let i = { url: this.url, cookies: this.cookies, headers: this.reqCtx.request.headers, routeDest: t.dest };
    if (!t.has?.find((r) => {
      let o = A(r, i);
      return o.newRouteDest && (i.routeDest = o.newRouteDest), !o.valid;
    }) && !t.missing?.find((r) => A(r, i).valid) && !(s && t.status !== this.status)) {
      if (a && t.dest) {
        let r = /\/(\(\.+\))+/, o = r.test(t.dest), c = r.test(this.path);
        if (o && !c)
          return;
      }
      return { routeMatch: n, routeDest: i.routeDest };
    }
  }
  processMiddlewareResp(t) {
    let s = "x-middleware-override-headers", a = t.headers.get(s);
    if (a) {
      let c = new Set(a.split(",").map((h) => h.trim()));
      for (let h of c.keys()) {
        let d = `x-middleware-request-${h}`, g = t.headers.get(d);
        this.reqCtx.request.headers.get(h) !== g && (g ? this.reqCtx.request.headers.set(h, g) : this.reqCtx.request.headers.delete(h)), t.headers.delete(d);
      }
      t.headers.delete(s);
    }
    let n = "x-middleware-rewrite", i = t.headers.get(n);
    if (i) {
      let c = new URL(i, this.url), h = this.url.hostname !== c.hostname;
      this.path = h ? `${c}` : c.pathname, m(this.searchParams, c.searchParams), t.headers.delete(n);
    }
    let r = "x-middleware-next";
    t.headers.get(r) ? t.headers.delete(r) : !i && !t.headers.has("location") ? (this.body = t.body, this.status = t.status) : t.headers.has("location") && t.status >= 300 && t.status < 400 && (this.status = t.status), x(this.reqCtx.request.headers, t.headers), x(this.headers.normal, t.headers), this.headers.middlewareLocation = t.headers.get("location");
  }
  async runRouteMiddleware(t) {
    if (!t)
      return true;
    let s = t && this.output[t];
    if (!s || s.type !== "middleware")
      return this.status = 500, false;
    let a = await b(s, this.reqCtx, { path: this.path, searchParams: this.searchParams, headers: this.headers, status: this.status });
    return this.middlewareInvoked.push(t), a.status === 500 ? (this.status = a.status, false) : (this.processMiddlewareResp(a), true);
  }
  applyRouteOverrides(t) {
    !t.override || (this.status = void 0, this.headers.normal = new Headers(), this.headers.important = new Headers());
  }
  applyRouteHeaders(t, s, a) {
    !t.headers || (x(this.headers.normal, t.headers, { match: s, captureGroupKeys: a }), t.important && x(this.headers.important, t.headers, { match: s, captureGroupKeys: a }));
  }
  applyRouteStatus(t) {
    !t.status || (this.status = t.status);
  }
  applyRouteDest(t, s, a) {
    if (!t.dest)
      return this.path;
    let n = this.path, i = t.dest;
    this.wildcardMatch && /\$wildcard/.test(i) && (i = i.replace(/\$wildcard/g, this.wildcardMatch.value)), this.path = T(i, s, a);
    let r = /\/index\.rsc$/i.test(this.path), o = /^\/(?:index)?$/i.test(n), c = /^\/__index\.prefetch\.rsc$/i.test(n);
    r && !o && !c && (this.path = n);
    let h = /\.rsc$/i.test(this.path), d = /\.prefetch\.rsc$/i.test(this.path), g = this.path in this.output;
    h && !d && !g && (this.path = this.path.replace(/\.rsc/i, ""));
    let N = new URL(this.path, this.url);
    return m(this.searchParams, N.searchParams), w(this.path) || (this.path = N.pathname), n;
  }
  applyLocaleRedirects(t) {
    if (!t.locale?.redirect || !/^\^(.)*$/.test(t.src) && t.src !== this.path || this.headers.normal.has("location"))
      return;
    let { locale: { redirect: a, cookie: n } } = t, i = n && this.cookies[n], r = I(i ?? ""), o = I(this.reqCtx.request.headers.get("accept-language") ?? ""), d = [...r, ...o].map((g) => a[g]).filter(Boolean)[0];
    if (d) {
      !this.path.startsWith(d) && (this.headers.normal.set("location", d), this.status = 307);
      return;
    }
  }
  getLocaleFriendlyRoute(t, s) {
    return !this.locales || s !== "miss" ? t : z(t.src, this.locales) ? { ...t, src: t.src.replace(/\/\(\.\*\)\$$/, "(?:/(.*))?$") } : t;
  }
  async checkRoute(t, s) {
    let a = this.getLocaleFriendlyRoute(s, t), { routeMatch: n, routeDest: i } = this.checkRouteMatch(a, { checkStatus: t === "error", checkIntercept: t === "rewrite" }) ?? {}, r = { ...a, dest: i };
    if (!n?.match || r.middlewarePath && this.middlewareInvoked.includes(r.middlewarePath))
      return "skip";
    let { match: o, captureGroupKeys: c } = n;
    if (this.applyRouteOverrides(r), this.applyLocaleRedirects(r), !await this.runRouteMiddleware(r.middlewarePath))
      return "error";
    if (this.body !== void 0 || this.headers.middlewareLocation)
      return "done";
    this.applyRouteHeaders(r, o, c), this.applyRouteStatus(r);
    let d = this.applyRouteDest(r, o, c);
    if (r.check && !w(this.path))
      if (d === this.path) {
        if (t !== "miss")
          return this.checkPhase(L(t));
        this.status = 404;
      } else if (t === "miss") {
        if (!(this.path in this.output) && !(this.path.replace(/\/$/, "") in this.output))
          return this.checkPhase("filesystem");
        this.status === 404 && (this.status = void 0);
      } else
        return this.checkPhase("none");
    return !r.continue || r.status && r.status >= 300 && r.status <= 399 ? "done" : "next";
  }
  async checkPhase(t) {
    if (this.checkPhaseCounter++ >= 50)
      return console.error(`Routing encountered an infinite loop while checking ${this.url.pathname}`), this.status = 500, "error";
    this.middlewareInvoked = [];
    let s = true;
    for (let i of this.routes[t]) {
      let r = await this.checkRoute(t, i);
      if (r === "error")
        return "error";
      if (r === "done") {
        s = false;
        break;
      }
    }
    if (t === "hit" || w(this.path) || this.headers.normal.has("location") || !!this.body)
      return "done";
    if (t === "none")
      for (let i of this.locales) {
        let r = new RegExp(`/${i}(/.*)`), c = this.path.match(r)?.[1];
        if (c && c in this.output) {
          this.path = c;
          break;
        }
      }
    let a = this.path in this.output;
    if (!a && this.path.endsWith("/")) {
      let i = this.path.replace(/\/$/, "");
      a = i in this.output, a && (this.path = i);
    }
    if (t === "miss" && !a) {
      let i = !this.status || this.status < 400;
      this.status = i ? 404 : this.status;
    }
    let n = "miss";
    return a || t === "miss" || t === "error" ? n = "hit" : s && (n = L(t)), this.checkPhase(n);
  }
  async run(t = "none") {
    this.checkPhaseCounter = 0;
    let s = await this.checkPhase(t);
    return this.headers.normal.has("location") && (!this.status || this.status < 300 || this.status >= 400) && (this.status = 307), s;
  }
}, "k");
async function Q(e, t, s, a) {
  let n = new k(t.routes, s, e, a, t.wildcard), i = await ee(n);
  return Ce(e, i, s);
}
__name(Q, "Q");
__name2(Q, "Q");
async function ee(e, t = "none", s = false) {
  return await e.run(t) === "error" || !s && e.status && e.status >= 400 ? ee(e, "error", true) : { path: e.path, status: e.status, headers: e.headers, searchParams: e.searchParams, body: e.body };
}
__name(ee, "ee");
__name2(ee, "ee");
async function Ce(e, { path: t = "/404", status: s, headers: a, searchParams: n, body: i }, r) {
  let o = a.normal.get("location");
  if (o) {
    if (o !== a.middlewareLocation) {
      let d = [...n.keys()].length ? `?${n.toString()}` : "";
      a.normal.set("location", `${o ?? "/"}${d}`);
    }
    return new Response(null, { status: s, headers: a.normal });
  }
  let c;
  if (i !== void 0)
    c = new Response(i, { status: s });
  else if (w(t)) {
    let d = new URL(t);
    m(d.searchParams, n), c = await fetch(d, e.request);
  } else
    c = await b(r[t], e, { path: t, status: s, headers: a, searchParams: n });
  let h = a.normal;
  return x(h, c.headers), x(h, a.important), c = new Response(c.body, { ...c, status: s || c.status, headers: h }), c;
}
__name(Ce, "Ce");
__name2(Ce, "Ce");
l();
u();
p();
function te() {
  globalThis.__nextOnPagesRoutesIsolation ??= { _map: /* @__PURE__ */ new Map(), getProxyFor: ke };
}
__name(te, "te");
__name2(te, "te");
function ke(e) {
  let t = globalThis.__nextOnPagesRoutesIsolation._map.get(e);
  if (t)
    return t;
  let s = je();
  return globalThis.__nextOnPagesRoutesIsolation._map.set(e, s), s;
}
__name(ke, "ke");
__name2(ke, "ke");
function je() {
  let e = /* @__PURE__ */ new Map();
  return new Proxy(globalThis, { get: (t, s) => e.has(s) ? e.get(s) : Reflect.get(globalThis, s), set: (t, s, a) => Ee.has(s) ? Reflect.set(globalThis, s, a) : (e.set(s, a), true) });
}
__name(je, "je");
__name2(je, "je");
var Ee = /* @__PURE__ */ new Set(["_nextOriginalFetch", "fetch", "__incrementalCache"]);
var fa = { async fetch(e, t, s) {
  te(), Z();
  let a = await __ALSes_PROMISE__;
  if (!a) {
    let r = new URL(e.url), o = await t.ASSETS.fetch(`${r.protocol}//${r.host}/cdn-cgi/errors/no-nodejs_compat.html`), c = o.ok ? o.body : "Error: Could not access built-in Node.js modules. Please make sure that your Cloudflare Pages project has the 'nodejs_compat' compatibility flag set.";
    return new Response(c, { status: 503 });
  }
  let { envAsyncLocalStorage: n, requestContextAsyncLocalStorage: i } = a;
  return n.run({ ...t, NODE_ENV: "production", SUSPENSE_CACHE_URL: v }, async () => i.run({ env: t, ctx: s, cf: e.cf }, async () => {
    if (new URL(e.url).pathname.startsWith("/_next/image"))
      return B(e, { buildOutput: f, assetsFetcher: t.ASSETS, imagesConfig: _.images });
    let o = D(e);
    return Q({ request: o, ctx: s, assetsFetcher: t.ASSETS }, _, f, y);
  }));
} };

// node_modules/wrangler/templates/pages-dev-util.ts
function isRoutingRuleMatch(pathname, routingRule) {
  if (!pathname) {
    throw new Error("Pathname is undefined.");
  }
  if (!routingRule) {
    throw new Error("Routing rule is undefined.");
  }
  const ruleRegExp = transformRoutingRuleToRegExp(routingRule);
  return pathname.match(ruleRegExp) !== null;
}
__name(isRoutingRuleMatch, "isRoutingRuleMatch");
function transformRoutingRuleToRegExp(rule) {
  let transformedRule;
  if (rule === "/" || rule === "/*") {
    transformedRule = rule;
  } else if (rule.endsWith("/*")) {
    transformedRule = `${rule.substring(0, rule.length - 2)}(/*)?`;
  } else if (rule.endsWith("/")) {
    transformedRule = `${rule.substring(0, rule.length - 1)}(/)?`;
  } else if (rule.endsWith("*")) {
    transformedRule = rule;
  } else {
    transformedRule = `${rule}(/)?`;
  }
  transformedRule = `^${transformedRule.replaceAll(/\./g, "\\.").replaceAll(/\*/g, ".*")}$`;
  return new RegExp(transformedRule);
}
__name(transformRoutingRuleToRegExp, "transformRoutingRuleToRegExp");

// .wrangler/tmp/pages-oQFXD7/ielzu2gt0yc.js
var define_ROUTES_default = { version: 1, description: "Built with @cloudflare/next-on-pages@1.13.5.", include: ["/*"], exclude: ["/_next/static/*"] };
var routes = define_ROUTES_default;
var pages_dev_pipeline_default = {
  fetch(request, env, context) {
    const { pathname } = new URL(request.url);
    for (const exclude of routes.exclude) {
      if (isRoutingRuleMatch(pathname, exclude)) {
        return env.ASSETS.fetch(request);
      }
    }
    for (const include of routes.include) {
      if (isRoutingRuleMatch(pathname, include)) {
        if (fa.fetch === void 0) {
          throw new TypeError("Entry point missing `fetch` handler");
        }
        return fa.fetch(request, env, context);
      }
    }
    return env.ASSETS.fetch(request);
  }
};

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-tI0Suc/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = pages_dev_pipeline_default;

// node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-tI0Suc/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof __Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
__name(__Facade_ScheduledController__, "__Facade_ScheduledController__");
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = (request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    };
    #dispatcher = (type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    };
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
/*!
 * cookie
 * Copyright(c) 2012-2014 Roman Shtylman
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */
//# sourceMappingURL=ielzu2gt0yc.js.map
