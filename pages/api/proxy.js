import { createProxyMiddleware } from "http-proxy-middleware";

// Disable Next.js body parsing for proxy
export const config = {
  api: {
    bodyParser: false,
  },
};

const proxy = createProxyMiddleware({
  target: process.env.BACKEND_URL || "http://localhost:5000",
  changeOrigin: true,
  pathRewrite: {
    "^/api/backend": "/api", // rewrite path
  },
  onProxyReq: (proxyReq, req, res) => {
    // Log proxy requests in development
    if (process.env.NODE_ENV === "development") {
      console.log(`Proxying ${req.method} ${req.url} to ${proxyReq.path}`);
    }

    // Handle CORS headers
    if (req.method === "OPTIONS") {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader(
        "Access-Control-Allow-Methods",
        "GET,POST,PUT,DELETE,OPTIONS"
      );
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type,Authorization"
      );
      res.status(200).end();
      return;
    }
  },
  onProxyRes: (proxyRes, req, res) => {
    // Add CORS headers to response
    proxyRes.headers["Access-Control-Allow-Origin"] = "*";
    proxyRes.headers["Access-Control-Allow-Methods"] =
      "GET,POST,PUT,DELETE,OPTIONS";
    proxyRes.headers["Access-Control-Allow-Headers"] =
      "Content-Type,Authorization";

    // Log proxy responses in development
    if (process.env.NODE_ENV === "development") {
      console.log(`Proxy response: ${proxyRes.statusCode} for ${req.url}`);
    }
  },
  onError: (err, req, res) => {
    console.error("Proxy error:", err);
    res.status(500).json({
      error: "Proxy error",
      message: err.message,
      path: req.url,
    });
  },
});

export default function handler(req, res) {
  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,DELETE,OPTIONS"
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
    res.status(200).end();
    return;
  }

  // Route to proxy middleware
  return proxy(req, res);
}
