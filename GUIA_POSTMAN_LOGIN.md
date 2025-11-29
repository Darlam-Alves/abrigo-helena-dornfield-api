# 📬 Guia Completo - Testar Login no Postman

## 🚀 Pré-requisitos

1. **Servidor rodando:**
   ```bash
   npm start
   ```
   Deve aparecer: `🚀 Servidor rodando na porta 3001`

2. **Postman instalado** ou use a versão web

---

## 📋 Collection de Testes

### 1️⃣ **Cadastrar Primeira Usuária**

**Configuração:**
```
Nome da Request: 1. Cadastrar Maria
Método: POST
URL: http://localhost:3001/api/login
```

**Headers:**
```
Content-Type: application/json
```

**Body (selecione "raw" e "JSON"):**
```json
{
  "login": "maria@abrigo.com",
  "password": "maria123"
}
```

**Clique em "Send"**

**✅ Resposta Esperada (201 Created):**
```json
{
  "id": 1,
  "login": "maria@abrigo.com"
}
```

**❌ Note:** Senha NÃO é retornada (segurança!)

---

### 2️⃣ **Fazer Login (Autenticar)**

**Configuração:**
```
Nome da Request: 2. Login Maria
Método: POST
URL: http://localhost:3001/api/login/auth
```

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "login": "maria@abrigo.com",
  "password": "maria123"
}
```

**Clique em "Send"**

**✅ Resposta Esperada (200 OK):**
```json
{
  "message": "Login realizado com sucesso.",
  "user": {
    "id": 1,
    "login": "maria@abrigo.com"
  }
}
```

---

### 3️⃣ **Testar Senha Incorreta**

**Configuração:**
```
Nome da Request: 3. Login com Senha Errada
Método: POST
URL: http://localhost:3001/api/login/auth
```

**Body (raw JSON):**
```json
{
  "login": "maria@abrigo.com",
  "password": "senhaerrada123"
}
```

**Clique em "Send"**

**✅ Resposta Esperada (401 Unauthorized):**
```json
{
  "message": "Senha incorreta."
}
```

---

### 4️⃣ **Testar Usuário Inexistente**

**Configuração:**
```
Nome da Request: 4. Login Usuário Inexistente
Método: POST
URL: http://localhost:3001/api/login/auth
```

**Body (raw JSON):**
```json
{
  "login": "naoexiste@abrigo.com",
  "password": "qualquersenha"
}
```

**Clique em "Send"**

**✅ Resposta Esperada (401 Unauthorized):**
```json
{
  "message": "Usuário não encontrado."
}
```

---

### 5️⃣ **Cadastrar Segunda Usuária**

**Configuração:**
```
Nome da Request: 5. Cadastrar Joana
Método: POST
URL: http://localhost:3001/api/login
```

**Body (raw JSON):**
```json
{
  "login": "joana@abrigo.com",
  "password": "joana123"
}
```

**Clique em "Send"**

**✅ Resposta Esperada (201 Created):**
```json
{
  "id": 2,
  "login": "joana@abrigo.com"
}
```

---

### 6️⃣ **Listar Todos os Usuários**

**Configuração:**
```
Nome da Request: 6. Listar Usuários
Método: GET
URL: http://localhost:3001/api/login
```

**Clique em "Send"** (não precisa de Body)

**✅ Resposta Esperada (200 OK):**
```json
[
  {
    "id": 1,
    "login": "maria@abrigo.com"
  },
  {
    "id": 2,
    "login": "joana@abrigo.com"
  }
]
```

**❌ Note:** Senhas NÃO são retornadas!

---

### 7️⃣ **Atualizar Senha**

**Configuração:**
```
Nome da Request: 7. Atualizar Senha Maria
Método: PUT
URL: http://localhost:3001/api/login/1
```
**❗ Note:** O `1` é o ID da usuária Maria

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "password": "maria456"
}
```

**Clique em "Send"**

**✅ Resposta Esperada (200 OK):**
```json
{
  "id": 1,
  "login": "maria@abrigo.com",
  "message": "Usuário atualizado com sucesso."
}
```

---

### 8️⃣ **Testar Login com Nova Senha**

**Configuração:**
```
Nome da Request: 8. Login Maria Nova Senha
Método: POST
URL: http://localhost:3001/api/login/auth
```

**Body (raw JSON):**
```json
{
  "login": "maria@abrigo.com",
  "password": "maria456"
}
```

**Clique em "Send"**

**✅ Resposta Esperada (200 OK):**
```json
{
  "message": "Login realizado com sucesso.",
  "user": {
    "id": 1,
    "login": "maria@abrigo.com"
  }
}
```

---

### 9️⃣ **Testar Senha Antiga (deve falhar)**

**Configuração:**
```
Nome da Request: 9. Login Senha Antiga
Método: POST
URL: http://localhost:3001/api/login/auth
```

**Body (raw JSON):**
```json
{
  "login": "maria@abrigo.com",
  "password": "maria123"
}
```

**Clique em "Send"**

**✅ Resposta Esperada (401 Unauthorized):**
```json
{
  "message": "Senha incorreta."
}
```

---

## 🎯 Ordem Recomendada de Testes

Execute nesta sequência:

1. ✅ Cadastrar Maria
2. ✅ Login Maria (senha correta)
3. ❌ Login Maria (senha incorreta)
4. ❌ Login usuário inexistente
5. ✅ Cadastrar Joana
6. ✅ Listar usuários (deve ter Maria e Joana)
7. ✅ Atualizar senha da Maria
8. ✅ Login Maria (nova senha)
9. ❌ Login Maria (senha antiga - deve falhar)

---

## 📸 Como Fica no Postman

Sua collection deve ter esta estrutura:

```
Abrigo Helena - Login
├── 1. Cadastrar Maria (POST)
├── 2. Login Maria (POST)
├── 3. Login com Senha Errada (POST)
├── 4. Login Usuário Inexistente (POST)
├── 5. Cadastrar Joana (POST)
├── 6. Listar Usuários (GET)
├── 7. Atualizar Senha Maria (PUT)
├── 8. Login Maria Nova Senha (POST)
└── 9. Login Senha Antiga (POST)
```

---

## 🔍 O Que Observar

### ✅ Sucesso (Status 200 ou 201):
- Campo `password` **NUNCA** aparece nas respostas
- Login retorna `message` e `user`
- Cadastro retorna `id` e `login`

### ❌ Erro (Status 400 ou 401):
- Retorna `message` explicando o erro
- 401: Credenciais incorretas
- 400: Dados inválidos

---

## 💾 Importar Collection Pronta

Cole este JSON no Postman (Import → Raw text):

```json
{
  "info": {
    "name": "Abrigo Helena - Login",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "1. Cadastrar Maria",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"login\": \"maria@abrigo.com\",\n  \"password\": \"maria123\"\n}"
        },
        "url": {
          "raw": "http://localhost:3001/api/login",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3001",
          "path": ["api", "login"]
        }
      }
    },
    {
      "name": "2. Login Maria",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"login\": \"maria@abrigo.com\",\n  \"password\": \"maria123\"\n}"
        },
        "url": {
          "raw": "http://localhost:3001/api/login/auth",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3001",
          "path": ["api", "login", "auth"]
        }
      }
    },
    {
      "name": "3. Login com Senha Errada",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"login\": \"maria@abrigo.com\",\n  \"password\": \"senhaerrada123\"\n}"
        },
        "url": {
          "raw": "http://localhost:3001/api/login/auth",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3001",
          "path": ["api", "login", "auth"]
        }
      }
    },
    {
      "name": "4. Login Usuário Inexistente",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"login\": \"naoexiste@abrigo.com\",\n  \"password\": \"qualquersenha\"\n}"
        },
        "url": {
          "raw": "http://localhost:3001/api/login/auth",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3001",
          "path": ["api", "login", "auth"]
        }
      }
    },
    {
      "name": "5. Cadastrar Joana",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"login\": \"joana@abrigo.com\",\n  \"password\": \"joana123\"\n}"
        },
        "url": {
          "raw": "http://localhost:3001/api/login",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3001",
          "path": ["api", "login"]
        }
      }
    },
    {
      "name": "6. Listar Usuários",
      "request": {
        "method": "GET",
        "url": {
          "raw": "http://localhost:3001/api/login",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3001",
          "path": ["api", "login"]
        }
      }
    },
    {
      "name": "7. Atualizar Senha Maria",
      "request": {
        "method": "PUT",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"password\": \"maria456\"\n}"
        },
        "url": {
          "raw": "http://localhost:3001/api/login/1",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3001",
          "path": ["api", "login", "1"]
        }
      }
    },
    {
      "name": "8. Login Maria Nova Senha",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"login\": \"maria@abrigo.com\",\n  \"password\": \"maria456\"\n}"
        },
        "url": {
          "raw": "http://localhost:3001/api/login/auth",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3001",
          "path": ["api", "login", "auth"]
        }
      }
    },
    {
      "name": "9. Login Senha Antiga",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"login\": \"maria@abrigo.com\",\n  \"password\": \"maria123\"\n}"
        },
        "url": {
          "raw": "http://localhost:3001/api/login/auth",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3001",
          "path": ["api", "login", "auth"]
        }
      }
    }
  ]
}
```

---

## ✅ Checklist Final

Antes de testar:
- [ ] Servidor rodando (`npm start`)
- [ ] Postman aberto
- [ ] Collection criada ou importada
- [ ] Banco de dados funcionando

Durante os testes:
- [ ] Todos os status codes estão corretos
- [ ] Senhas NÃO aparecem nas respostas
- [ ] Mensagens de erro são claras

---

**Pronto para testar! 🚀**

