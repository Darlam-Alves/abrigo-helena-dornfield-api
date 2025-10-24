##  Pré-requisitos

Antes de começar, certifique-se de que você tem os seguintes softwares instalados na sua máquina:

-   [Node.js](https://nodejs.org/) (versão LTS recomendada)
-   NPM (geralmente vem instalado com o Node.js)
-   [PostgreSQL](https://www.postgresql.org/download/)
-   [Git](https://git-scm.com/downloads/)
-   [Postman](https://www.postman.com/downloads/) (Recomendado para testar a API)

## 🔧 Guia de Instalação e Configuração

Siga estes passos para configurar o ambiente de desenvolvimento local.

### 1. Clonar o Repositório

Primeiro, clone o repositório do GitHub para a sua máquina local.

### 2. Instalar dependências do projeto
```npm install```

### 3. Configurar o Banco de Dados PostgreSQL
```psql -U seu_usuario_aqui -d postgres -c "CREATE DATABASE helena_dornfield_db;"```

### 4. 
```psql -U seu_usuario_aqui -d helena_dornfield_db -f database/initial_schema.sql```


#### a. Crie o Banco de Dados

Conecte-se ao psql como seu usuário principal e crie o banco de dados vazio.
Bash

# Conecta ao psql e executa o comando CREATE DATABASE
```psql -U seu_usuario_aqui -d postgres -c "CREATE DATABASE helena_dornfield_db;"```

Nota: Substitua seu_usuario_aqui pelo seu nome de usuário do PostgreSQL.

b. Crie as Tabelas

Execute o script de schema para criar todas as tabelas necessárias dentro do banco de dados que você acabou de criar.
Bash

# Executa o arquivo de schema no banco de dados correto
```psql -U seu_usuario_aqui -d helena_dornfield_db -f database/initial_schema.sql```

### 4. Configurar as Variáveis de Ambiente

As variáveis de ambiente guardam informações sensíveis e de configuração, como as senhas do banco de dados.

a. Crie o arquivo .env
Crie uma cópia do arquivo .env abaixo substituindo pelo seu DB_USER e DB_PASSWORD

conteudo do arquivo .env
PORT=3001
DB_HOST=localhost
DB_USER=
DB_PASSWORD=
DB_NAME=helena_dornfield_db
DB_PORT=5432 

### 5. criar arquivo .gitignore para ignorar módulos do node, variáveis de ambiente e etc:
npm-debug.log*
yarn-error.log
yarn-debug.log
lerna-debug.log

node_modules/
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

*.log

### 6. Rodar o projeto
```npm start```

### 7. Usar o postman para testar as requisições e validar na base de dados
ex: POST http://localhost:3001/api/medicamentos
{ 
    "nome": "dipirona", 
    "dosagem": 1, 
    "unidade_medida": "g", 
    "principio_ativo": "dipirona", 
    "estoque_minimo": 10 
}
verificar no terminal na execução do banco de dados postgres se o medicamento foi inserido no banco de dados 
fazendo um SELECT na respectiva tabela

```SELECT * FROM medicamento```