const express = require("express"); // 1. Importa o express
const app = express();              // 2. Define a variável 'app'

// IMPORTANTE: Permite que o servidor pegue o IP real no Render
app.set('trust proxy', true); 

const PORT = process.env.PORT || 10000;

// Rota para o Pixel/Verificação
app.get("/pixel", async (req, res) => {
    const { t, avatar, nome, primurl } = req.query;
    
    // Captura o IP
    let ip = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    if (ip && ip.includes(',')) ip = ip.split(',')[0].trim();

    console.log(`Recebido: ${nome} - IP: ${ip}`);

    if (primurl) {
        // Envia os dados de volta para o Second Life
        const urlRetorno = `${primurl}?acao=retorno&nome=${encodeURIComponent(nome)}&avatar=${encodeURIComponent(avatar)}&ip=${encodeURIComponent(ip)}`;
        
        try {
            await fetch(urlRetorno);
            console.log("Dados enviados ao SL com sucesso.");
        } catch (err) {
            console.log("Erro ao conectar com o SL:", err.message);
        }
    }

    // Resposta visual para o usuário no navegador
    res.send(`
        <html>
            <body style="background:#08111f; color:white; text-align:center; font-family:sans-serif; padding-top:50px;">
                <h2>✔ Verificado</h2>
                <p>Obrigado, ${nome}. Seu acesso foi registrado.</p>
            </body>
        </html>
    `);
});

// Inicia o servidor
app.listen(PORT, "0.0.0.0", () => {
    console.log("Servidor rodando na porta " + PORT);
});
