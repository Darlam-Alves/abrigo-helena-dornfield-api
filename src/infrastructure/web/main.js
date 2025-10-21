console.log("1. Iniciando main.js...");

const express = require('express');
console.log("2. Express importado com sucesso.");

require('dotenv').config();
console.log("3. Dotenv configurado.");

const routes = require('./routes');
console.log("4. Arquivo de rotas importado com sucesso.");

const app = express();
const port = process.env.PORT || 3001;

console.log("5. App Express criada.");

app.use(express.json());

app.use('/api', routes);
console.log("6. Rotas configuradas.");

app.listen(port, () => {
  console.log(`🚀 Servidor rodando na porta ${port}`);
});