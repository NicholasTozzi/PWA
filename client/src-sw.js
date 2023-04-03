const { warmStrategyCache } = require("workbox-recipes");
const { CacheFirst, StaleWhileRevalidate } = require("workbox-strategies");
const { registerRoute } = require("workbox-routing");
const { CacheableResponsePlugin } = require("workbox-cacheable-response");
const { ExpirationPlugin } = require("workbox-expiration");
const { precacheAndRoute } = require("workbox-precaching/precacheAndRoute");

// The __WB_MANIFEST variable is an array of objects that represents the resources to be precached
//by the service worker. Each object in the array specifies a URL for the resource and an optional
//set of metadata that can be used to configure the caching strategy for that resource.

precacheAndRoute(self.__WB_MANIFEST);
//This function call does 3 things:
//!Precaches all the URLs and assets specified in the __WB_MANIFEST array using the default caching strategy.

//!!Creates a route for each URL and asset that was precached, so that subsequent requests for those resources will be served from the cache.

//!!!Returns a promise that resolves when all the resources have been precached and routes have been created.

// Set up page cache
const pageCache = new CacheFirst({
  //instantiates a new Cache
  cacheName: "page-cache",
  plugins: [
    //determines if the response is cache-able or not
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60, //30 days is max before it resets the cache
      //maxAgeSeconds option specifies the maximum age (in seconds) of a cached response
      //before it is considered stale and needs to be revalidated.
    }),
  ],
});

warmStrategyCache({
  //configuring a cache warming mechanism for the specified URLs using the pageCache strategy.

  urls: ["/index.html", "/"],
  strategy: pageCache,
  //When the service worker is installed or updated, the warmStrategyCache function is executed, which adds the
  //specified URLs to the cache using the pageCache strategy. This ensures that the cached resources are available
  //when the user requests them, reducing the time it takes to load the content and improving the overall user experience.
});

registerRoute(({ request }) => request.mode === "navigate", pageCache);
//when the user navigates to a page that has been cached, the page will be served from the cache, and if the page is not cached,
//the service worker will attempt to retrieve it from the network and cache it for future requests.

// Set up asset cache
registerRoute(
  ({ request }) => ["style", "script", "worker"].includes(request.destination),
  new StaleWhileRevalidate({
    //This strategy attempts to serve the cached asset while simultaneously fetching an updated version from the network in the background.
    cacheName: "asset-cache",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);
