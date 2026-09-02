const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;
const DB_FILE = path.join(__dirname, "data_pets.json");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".mp3": "audio/mpeg"
};

function readPetsDb() {
  try {
    if (fs.existsSync(DB_FILE)) {
      return JSON.parse(fs.readFileSync(DB_FILE, "utf8")) || [];
    }
  } catch (e) {
    console.error("Erro ao ler DB:", e.message);
  }
  return [];
}

function savePetsDb(pets) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(pets, null, 2), "utf8");
    return true;
  } catch (e) {
    console.error("Erro ao salvar DB:", e.message);
    return false;
  }
}

const server = http.createServer((req, res) => {
  // CORS Headers para qualquer dispositivo / celular / túnel
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Bypass-Tunnel-Reminder");
  res.setHeader("Bypass-Tunnel-Reminder", "true");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  try {
    const parsedUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    let pathname = parsedUrl.pathname;

    // --- API DE PETS (SINCRONIZAÇÃO TOTAL MULTI-DISPOSITIVOS) ---
    if (pathname === "/api/pets") {
      if (req.method === "GET") {
        const idParam = (parsedUrl.searchParams.get("id") || parsedUrl.searchParams.get("pet") || "").toLowerCase().trim();
        const pets = readPetsDb();
        if (idParam) {
          const found = pets.find(p => (p.id && p.id.toLowerCase() === idParam) || (p.nome && p.nome.toLowerCase() === idParam));
          res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
          res.end(JSON.stringify(found || null));
        } else {
          res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
          res.end(JSON.stringify(pets));
        }
        return;
      } else if (req.method === "POST") {
        let body = "";
        req.on("data", chunk => body += chunk);
        req.on("end", () => {
          try {
            const petData = JSON.parse(body);
            if (!petData || !petData.nome) {
              res.writeHead(400, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ error: "Dados incompletos" }));
              return;
            }
            const pets = readPetsDb();
            const petId = (petData.id || petData.nome.toLowerCase().replace(/[^a-z0-9]/g, "-")).trim();
            petData.id = petId;

            const idx = pets.findIndex(p => p.id === petId);
            if (idx !== -1) {
              pets[idx] = { ...pets[idx], ...petData };
            } else {
              pets.unshift(petData);
            }
            savePetsDb(pets);
            console.log(`[API] Pet salvo com sucesso: ${petId} (${petData.nome})`);
            res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
            res.end(JSON.stringify({ success: true, id: petId, pet: petData }));
          } catch (err) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: err.message }));
          }
        });
        return;
      }
    }

    // --- ROTAS AMIGÁVEIS E ARQUIVOS ESTÁTICOS ---
    if (pathname === "/" || pathname === "/mural" || pathname === "/estrelinhas") pathname = "/mural.html";
    if (pathname === "/memorial") pathname = "/memorial.html";
    if (pathname === "/social") pathname = "/social.html";
    if (pathname === "/gerador") pathname = "/gerador.html";
    if (pathname === "/vendas") pathname = "/vendas.html";

    let filePath = path.join(__dirname, pathname);

    // Se o arquivo não existir diretamente mas existir com .html, usa ele
    if (!fs.existsSync(filePath) && fs.existsSync(filePath + ".html")) {
      filePath = filePath + ".html";
      pathname = pathname + ".html";
    }

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
        "Content-Type": contentType
      });
      res.end(data);
    });
  } catch (e) {
    console.error(`[ERR] ${e.message}`);
    res.writeHead(500);
    res.end(e.message);
  }
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor Terranova Pet online em http://0.0.0.0:${PORT}`);
});
