const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;
const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml"
};

const server = http.createServer((req, res) => {
  try {
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    let pathname = parsedUrl.pathname;
    if (pathname === "/") pathname = "/memorial.html";

    const filePath = path.join(__dirname, pathname);

    console.log(`[REQ] ${req.method} ${pathname}`);

    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.error(`[404] ${pathname}`);
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Arquivo não encontrado: " + pathname);
        return;
      }
      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || "application/octet-stream";
      res.writeHead(200, {
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": "*"
      });
      res.end(data);
    });
  } catch (e) {
    console.error(`[ERR] ${e.message}`);
    res.writeHead(500);
    res.end(e.message);
  }
});

server.listen(PORT, () => {
  console.log(`Servidor Terranova Pet online em http://localhost:${PORT}`);
});
