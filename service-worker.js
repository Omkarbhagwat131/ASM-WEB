const CACHE_NAME = "asm-nextgen-v1";
const MAX_CACHED_RESOURCES = 120;

self.addEventListener("install", (event) => {
    event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
    event.waitUntil((async () => {
        const names = await caches.keys();
        await Promise.all(names.filter((name) => name.startsWith("asm-nextgen-") && name !== CACHE_NAME)
            .map((name) => caches.delete(name)));
        await self.clients.claim();
    })());
});

self.addEventListener("fetch", (event) => {
    const request = event.request;
    const url = new URL(request.url);
    if (request.method !== "GET" || url.origin !== self.location.origin) return;

    const isDocument = request.mode === "navigate";
    const isData = url.pathname.endsWith(".json");
    event.respondWith((isDocument || isData) ? networkFirst(request) : cacheAndRefresh(request));
});

async function networkFirst(request) {
    const cache = await caches.open(CACHE_NAME);
    try {
        const response = await fetch(request);
        if (response.ok) await cache.put(request, response.clone());
        return response;
    } catch {
        return (await cache.match(request)) || Response.error();
    }
}

async function cacheAndRefresh(request) {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    const refresh = fetch(request).then(async (response) => {
        if (response.ok && response.type === "basic") {
            await cache.put(request, response.clone());
            await trimCache(cache);
        }
        return response;
    }).catch(() => null);
    if (cached) {
        // Refresh in the background while serving the cached response immediately.
        void refresh;
        return cached;
    }
    return (await refresh) || Response.error();
}

async function trimCache(cache) {
    const requests = await cache.keys();
    if (requests.length > MAX_CACHED_RESOURCES) {
        await Promise.all(requests.slice(0, requests.length - MAX_CACHED_RESOURCES)
            .map((request) => cache.delete(request)));
    }
}
