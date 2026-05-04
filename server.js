const express = require("express");
const app = express();

app.set('trust proxy', true);

app.get("/pixel", async (req, res) => {
    const { nome, avatar, primurl } = req.query;
    let ip = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    if (ip && ip.includes(',')) ip = ip.split(',')[0].trim();

    if (primurl) {
        const urlRetorno = `${primurl}?acao=retorno&nome=${encodeURIComponent(nome)}&avatar=${encodeURIComponent(avatar)}&ip=${encodeURIComponent(ip)}`;
        try {
            await fetch(urlRetorno);
        } catch (err) {
            console.log("Erro ao enviar para o SL");
        }
    }

    // O servidor envia uma resposta vazia ou um pixel para não interferir na página
    res.status(200).send(""); 
});

app.listen(process.env.PORT || 10000, "0.0.0.0");
