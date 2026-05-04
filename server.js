const express = require("express");
const app = express();

const PORT = process.env.PORT || 10000;

const sessions = new Map();
const seenIPs = new Map();

app.get("/", (req, res) => {
  res.send("Servidor online.");
});

app.get("/create", (req, res) => {
  const t = req.query.t || "";
  const avatar = req.query.avatar || "";
  const nome = req.query.nome || "";
  const primurl = req.query.primurl || "";

  if (!t || !avatar || !primurl) {
    return res.status(400).send("ERROR");
  }

  sessions.set(t, {
    avatar,
    nome,
    primurl,
    createdAt: Date.now()
  });

  res.send("OK");
});

app.get("/pixel", async (req, res) => {
  const t = req.query.t || "";
  const s = sessions.get(t);

  const forwarded = req.headers["x-forwarded-for"] || "";
  const ip =
    forwarded.split(",")[0].trim() ||
    req.socket.remoteAddress ||
    "desconhecido";

  const navegador = req.headers["user-agent"] || "desconhecido";

  let status = "NOVO";
  let antigo = "";

  if (seenIPs.has(ip)) {
    status = "POSSIVEL_ALT";
    antigo = seenIPs.get(ip);
  } else {
    seenIPs.set(ip, s ? s.nome : "desconhecido");
  }

  if (s) {
    const retorno =
      s.primurl +
      "?acao=retorno" +
      "&avatar=" + encodeURIComponent(s.avatar) +
      "&nome=" + encodeURIComponent(s.nome) +
      "&ip=" + encodeURIComponent(ip) +
      "&navegador=" + encodeURIComponent(navegador) +
      "&status=" + encodeURIComponent(status) +
      "&antigo=" + encodeURIComponent(antigo);

    try {
      await fetch(retorno);
    } catch (e) {}

    sessions.delete(t);
  }

  const pixel = Buffer.from(
    "R0lGODlhAQABAPAAAP///wAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==",
    "base64"
  );

  res.setHeader("Content-Type", "image/gif");
  res.setHeader("Cache-Control", "no-store");
  res.end(pixel);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("Servidor rodando");
});
