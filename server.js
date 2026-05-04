const express = require("express");
const app = express();

// Configuração vital para o Render capturar o IP real
app.set('trust proxy', true);

const PORT = process.env.PORT || 10000;

app.get("/pixel", async (req, res) => {
    const { t, avatar, nome, primurl } = req.query;
    
    // Captura o IP do visitante
    let ip = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    if (ip && ip.includes(',')) ip = ip.split(',')[0].trim();

    console.log(`📡 Verificando: ${nome} [IP: ${ip}]`);

    // Retorno de dados para o objeto dentro do Second Life
    if (primurl) {
        const urlRetorno = `${primurl}?acao=retorno&nome=${encodeURIComponent(nome)}&avatar=${encodeURIComponent(avatar)}&ip=${encodeURIComponent(ip)}&t=${encodeURIComponent(t)}`;
        
        try {
            await fetch(urlRetorno);
            console.log(`✅ Sucesso: Dados enviados ao SL para ${nome}`);
        } catch (err) {
            console.log(`❌ Erro no retorno ao SL: ${err.message}`);
        }
    }

    // O que o usuário vê no navegador
    res.send(`
        <html>
        <head><meta charset="UTF-8"><title>Verificado</title></head>
        <body style="background:#08111f; color:white; text-align:center; font-family:sans-serif; padding-top:80px;">
            <div style="border:2px solid #4CAF50; display:inline-block; padding:30px; border-radius:15px; background:#0c1a2d;">
                <h1 style="color:#4CAF50; margin-top:0;">✔ Verificado</h1>
                <p style="font-size:1.2em;">Olá, <b>${nome}</b>!</p>
                <p>Seu acesso foi registrado e o IP capturado com sucesso.</p>
                <p style="color:#888; font-size:0.9em;">Você já pode fechar esta aba e voltar ao Second Life.</p>
            </div>
        </body>
        </html>
    `);
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
