export default async function handler(req, res) {
  const avatar = req.query.avatar || "";
  const nome = req.query.nome || "";
  const primurl = req.query.primurl || "";

  const forwarded = req.headers["x-forwarded-for"] || "";
  const ip = forwarded.split(",")[0].trim() || req.socket?.remoteAddress || "desconhecido";

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
    } catch (e) {
      console.log("Erro ao enviar para o prim:", e);
    }
  }

  res.setHeader("Content-Type", "text/html; charset=utf-8");

  res.end(`
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Verificação concluída</title>
  <style>
    body {
      margin: 0;
      min-height: 100vh;
      background: linear-gradient(135deg, #08111f, #16243a);
      color: white;
      font-family: Arial, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
    }
    .card {
      background: rgba(255,255,255,0.08);
      padding: 35px;
      border-radius: 22px;
      max-width: 520px;
      box-shadow: 0 25px 70px rgba(0,0,0,.45);
    }
    .ip {
      color: #38bdf8;
      font-size: 34px;
      font-weight: bold;
      word-break: break-all;
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>Verificação concluída</h1>
    <p>Seu IP detectado:</p>
    <div class="ip">${ip}</div>
    <p>Você já pode voltar ao Second Life.</p>
  </div>
</body>
</html>
  `);
}
