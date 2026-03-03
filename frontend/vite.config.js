VitePWA({
  registerType: "autoUpdate",
  workbox: {
    navigateFallback: "/offline.html",
    runtimeCaching: [
      {
        urlPattern: ({ url }) =>
          url.pathname.startsWith("/orders"),
        handler: "NetworkFirst",
        options: {
          cacheName: "orders-cache",
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 60 * 60 * 24, // 1 day
          },
        },
      },
      {
        urlPattern: ({ url }) =>
          url.pathname.startsWith("/menu"),
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "menu-cache",
        },
      },
      {
        urlPattern: ({ url }) =>
          url.pathname.startsWith("/customers"),
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "customer-cache",
        },
      },
    ],
  },
  manifest: {
    name: "Kaleva36",
    short_name: "K36",
    theme_color: "#ffffff",
    background_color: "#ffffff",
    display: "standalone",
    start_url: "/",
  },
})