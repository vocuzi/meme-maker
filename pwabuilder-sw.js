const CACHE = "pwabuilder-page";

const offlineFallbackPage = "index.html";

self.addEventListener("install", function (event) {
  console.log("[PWA Builder] Install Event processing");

  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      console.log("[PWA Builder] Cached offline page during install");

      // if (offlineFallbackPage === "offline-page.html") {
      //   return cache.add(new Response("TODO: Update the value of the offlineFallbackPage constant in the serviceworker."));
      // }

      return cache.addAll([
          "https://fonts.googleapis.com/css?family=Bebas+Neue&display=swap",
          "https://cdn.jsdelivr.net/npm/html2canvas@1.0.0-rc.5/dist/html2canvas.min.js",
          "https://unpkg.com/htmlshot@1.0.1/index.js",
          "/app.js",
          "/default.jpg",
          "/index.html"
        ]);
    })
  );
});

self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request).catch(function (error) {
      if (
        event.request.destination !== "document" ||
        event.request.mode !== "navigate"
      ) {
        return;
      }

      console.error("[PWA Builder] Network request Failed. Serving offline page " + error);
      return caches.open(CACHE).then(function (cache) {
        return cache.match(offlineFallbackPage);
      });
    })
  );
});

self.addEventListener("refreshOffline", function () {
  const offlinePageRequest = new Request(offlineFallbackPage);

  return fetch(offlineFallbackPage).then(function (response) {
    return caches.open(CACHE).then(function (cache) {
      console.log("[PWA Builder] Offline page updated from refreshOffline event: " + response.url);
      return cache.put(offlinePageRequest, response);
    });
  });
});
