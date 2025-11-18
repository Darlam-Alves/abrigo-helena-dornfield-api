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

// configuracao manual de cabecalhos sem cors
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();

});

app.use(express.json());

app.use('/api', routes);
console.log("6. Rotas configuradas.");

app.listen(port, () => {
  console.log(`🚀 Servidor rodando na porta ${port}`);
});