/**
 * Local dev proxy server to bypass CORS when developing with output: "export".
 * Proxies all requests from http://localhost:4000/api/* → https://api-staging.relipacheck.io.vn/api/*
 * Adds CORS headers so browser doesn't block.
 *
 * Usage: node dev-proxy.js
 */
const http = require("http");
const https = require("https");
const { URL } = require("url");

const PROXY_PORT = 4000;
const BACKEND_URL = "https://api-staging.relipacheck.io.vn";

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const targetUrl = new URL(req.url, BACKEND_URL);

  const options = {
    hostname: targetUrl.hostname,
    port: 443,
    path: targetUrl.pathname + targetUrl.search,
    method: req.method,
    headers: {
      ...req.headers,
      host: targetUrl.hostname,
    },
  };

  // Remove headers that cause issues
  delete options.headers["origin"];
  delete options.headers["referer"];

  const proxyReq = https.request(options, (proxyRes) => {
    // Copy status and headers from backend
    const responseHeaders = { ...proxyRes.headers };
    // Override CORS
    responseHeaders["access-control-allow-origin"] = "*";
    delete responseHeaders["transfer-encoding"]; // avoid chunked issues

    res.writeHead(proxyRes.statusCode, responseHeaders);
    proxyRes.pipe(res, { end: true });
  });

  proxyReq.on("error", (err) => {
    console.error("Proxy error:", err.message);
    res.writeHead(502, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Proxy error: " + err.message }));
  });

  req.pipe(proxyReq, { end: true });
});

server.listen(PROXY_PORT, () => {
  console.log(`✓ Dev proxy running: http://localhost:${PROXY_PORT} → ${BACKEND_URL}`);
  console.log(`  All /api/* requests will be proxied to backend.`);
});
