const express = require("express");
const app = express();

const PORT = process.env.PORT || 10000;

app.get("/", (req, res) => {
  res.send("Servidor online.");
});

app.get("/pixel", async (req, res) => {
  const token = req.query.t || "";
  const avatar = req.query.avatar || "";
  const nome = req.query.nome || "";
  const primurl = req.query.primurl || "";

  const forwarded = req.headers["x-forwarded-for"] || "";
  const ip =
    forwarded.split(",")[0].trim() ||
    req.socket.remoteAddress ||
    "desconhecido";

  const navegador = req.headers["user-agent"] || "desconhecido";

  if (primurl) {
    const retorno =
      primurl +
      "?acao=retorno" +
      "&token=" + encodeURIComponent(token) +
      "&avatar=" + encodeURIComponent(avatar) +
      "&nome=" + encodeURIComponent(nome) +
      "&ip=" + encodeURIComponent(ip) +
      "&navegador=" + encodeURIComponent(navegador);

    try {
      await fetch(retorno);
      console.log("Retorno enviado:", nome, ip);
    } catch (e) {
      console.log("Erro ao retornar ao prim:", e.message);
    }
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
  console.log("Servidor rodando na porta " + PORT);
});
