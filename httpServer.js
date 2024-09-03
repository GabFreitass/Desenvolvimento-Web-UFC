const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);
module.exports = { server }; // exportado para o servidor websocket

app.use(express.static('static'));
app.set("view engine", "ejs");
app.set("views", "static/views");
app.use(express.urlencoded({ extended: true })); // middleware para pegar o nome do jogador com o body

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/game/:gameId", (req, res) => {
    const gameId = req.params.gameId;
    const viewerName = req.query.viewerName;

    if (!viewerName) {
        return res.status(400).send('Nome do espectador é obrigatório');
    }

    res.render("game");
});

app.get("/ranking", (req, res) => {
    res.render("ranking");
});

app.post("/game", (req, res) => {
    const playerName = req.body["player-name"];
    const playerCharacter = parseInt(req.body["player-character"]);

    // Validação do nome do jogador
    if (!playerName || typeof playerName !== 'string' || playerName.trim().length === 0) {
        return res.status(400).send('Nome do jogador é obrigatório e deve ser uma string não vazia');
    }

    // Validação do personagem do jogador
    if (isNaN(playerCharacter) || playerCharacter < 0 || playerCharacter > 9) {
        return res.status(400).send('Espaçonave inválida. Escolha um número entre 0 e 9');
    }

    // Geração de ID de jogo único
    const gameId = '123';

    // Redirecionamento com parâmetros validados
    res.redirect(`/game/${gameId}?playerName=${encodeURIComponent(playerName.trim())}&playerCharacter=${playerCharacter}`);
});

// Função auxiliar para gerar ID de jogo único
function generateUniqueGameId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}