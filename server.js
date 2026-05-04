app.get("/pixel", async (req, res) => {
  const token = req.query.t || "";
  const avatar = req.query.avatar || "";
  const nome = req.query.nome || "";
  const primurl = req.query.primurl || "";

  // 1. Tenta pegar o IP direto pelo servidor primeiro
  let ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "0.0.0.0";
  if (ip.includes(',')) ip = ip.split(',')[0].trim();

  // 2. Se for uma requisição de retorno vinda do navegador (com IP externo no query)
  if (req.query.external_ip) {
      ip = req.query.external_ip;
  }

  if (primurl && req.query.acao === "retorno") {
    const retorno =
      primurl +
      "?acao=retorno" +
      "&token=" + encodeURIComponent(token) +
      "&avatar=" + encodeURIComponent(avatar) +
      "&nome=" + encodeURIComponent(nome) +
      "&ip=" + encodeURIComponent(ip);

    try {
      await fetch(retorno);
      return res.status(200).send("OK"); // Finaliza aqui se for apenas o retorno
    } catch (e) {
      return res.status(500).send("Erro");
    }
  }

  // Se for o acesso inicial, envia o HTML que tenta capturar o IP via API externa (ipify)
  res.send(`
    <html>
      <script>
        async function report() {
          let userIp = "${ip}";
          try {
            // Tenta pegar o IP real via API externa no navegador do usuário
            const response = await fetch("https://api.ipify.org?format=json");
            const data = await response.json();
            userIp = data.ip;
          } catch (e) { console.log("Falha ao usar ipify, usando IP do header."); }

          // Envia de volta para este mesmo servidor para que ele avise o LSL
          const finalUrl = window.location.href + "&acao=retorno&external_ip=" + userIp;
          fetch(finalUrl);
        }
        report();
      </script>
      <body style="background:#08111f; color:white; text-align:center; font-family:sans-serif;">
        <h2>✔ Verificado</h2>
        <p>Você já pode voltar ao Second Life.</p>
      </body>
    </html>
  `);
});
