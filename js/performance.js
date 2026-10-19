/* Summarize page and resource timings in DevTools without sending telemetry. */
window.addEventListener("load", () => {
    const navigation = performance.getEntriesByType("navigation")[0];
    const resources = performance.getEntriesByType("resource");
    const summary = {
        loadMs: navigation ? Math.round(navigation.loadEventEnd) : null,
        domContentLoadedMs: navigation ? Math.round(navigation.domContentLoadedEventEnd) : null,
        sameOriginResources: resources.filter((entry) => entry.name.startsWith(location.origin)).length,
        sameOriginTransferBytes: resources
            .filter((entry) => entry.name.startsWith(location.origin))
            .reduce((total, entry) => total + entry.transferSize, 0)
    };
    window.asmPerformance = summary;
    console.info("[ASM page performance]", summary);
}, { once: true });

/* Register the site's same-origin cache for repeat visits and offline use. */
if ("serviceWorker" in navigator && location.protocol !== "file:") {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("../service-worker.js")
            .catch((error) => console.warn("Offline cache unavailable:", error));
    }, { once: true });
}
