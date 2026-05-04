const express = require("express");
const app = express();

const PORT = process.env.PORT || 10000;

const sessions = new Map();

app.get("/create", (req, res) => {
  const t = req.query.t || "";
  const avatar = req.query.avatar || "";
  const nome = req.query.nome || "";
  const primurl = req.query.primurl || "";

  if (!t || !primurl) {
    return res.status(400).send("ERROR");
  }

  sessions.set(t, {
    avatar,
    nome,
    primurl
  });

  console.log("Sessão criada:", t, nome);

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

  if (s) {
    const retorno =
      s.primurl +
      "?acao=retorno"
      + "&avatar=" + encodeURIComponent(s.avatar)
      + "&nome=" + encodeURIComponent(s.nome)
      + "&ip=" + encodeURIComponent(ip)
      + "&navegador=" + encodeURIComponent(navegador)
      + "&token=" + encodeURIComponent(t);

    try {
      await fetch(retorno);
      console.log("Retorno enviado:", s.nome, ip);
    } catch (e) {
      console.log("Erro:", e.message);
    }

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
