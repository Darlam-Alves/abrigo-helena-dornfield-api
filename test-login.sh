#!/bin/bash

# 🔐 Script de Teste - Sistema de Login
# Execute com: bash test-login.sh

echo "🚀 Iniciando testes do sistema de login..."
echo ""

BASE_URL="http://localhost:3001/api"

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_test() {
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}📝 $1${NC}"
    echo ""
}

print_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓ $2${NC}"
    else
        echo -e "${RED}✗ $2${NC}"
    fi
}

# Teste 1: Cadastrar primeiro usuário
print_test "Teste 1: Cadastrar Maria"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST ${BASE_URL}/login \
  -H "Content-Type: application/json" \
  -d '{"login": "maria@abrigo.com", "password": "maria123"}')

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

if [ "$HTTP_CODE" -eq 201 ]; then
    print_result 0 "Maria cadastrada com sucesso"
    echo "$BODY" | python3 -m json.tool 2>/dev/null || echo "$BODY"
else
    print_result 1 "Falha ao cadastrar Maria (HTTP $HTTP_CODE)"
    echo "$BODY"
fi
echo ""

# Teste 2: Login com credenciais corretas
print_test "Teste 2: Login Maria (senha correta)"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST ${BASE_URL}/login/auth \
  -H "Content-Type: application/json" \
  -d '{"login": "maria@abrigo.com", "password": "maria123"}')

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

if [ "$HTTP_CODE" -eq 200 ]; then
    print_result 0 "Login realizado com sucesso"
    echo "$BODY" | python3 -m json.tool 2>/dev/null || echo "$BODY"
else
    print_result 1 "Falha no login (HTTP $HTTP_CODE)"
    echo "$BODY"
fi
echo ""

# Teste 3: Login com senha incorreta
print_test "Teste 3: Login com senha incorreta (deve falhar)"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST ${BASE_URL}/login/auth \
  -H "Content-Type: application/json" \
  -d '{"login": "maria@abrigo.com", "password": "senhaerrada"}')

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

if [ "$HTTP_CODE" -eq 401 ]; then
    print_result 0 "Erro 401 retornado corretamente"
    echo "$BODY" | python3 -m json.tool 2>/dev/null || echo "$BODY"
else
    print_result 1 "Deveria retornar 401 mas retornou HTTP $HTTP_CODE"
    echo "$BODY"
fi
echo ""

# Teste 4: Cadastrar segundo usuário
print_test "Teste 4: Cadastrar Joana"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST ${BASE_URL}/login \
  -H "Content-Type: application/json" \
  -d '{"login": "joana@abrigo.com", "password": "joana123"}')

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

if [ "$HTTP_CODE" -eq 201 ]; then
    print_result 0 "Joana cadastrada com sucesso"
    echo "$BODY" | python3 -m json.tool 2>/dev/null || echo "$BODY"
else
    print_result 1 "Falha ao cadastrar Joana (HTTP $HTTP_CODE)"
    echo "$BODY"
fi
echo ""

# Teste 5: Listar usuários
print_test "Teste 5: Listar todos os usuários"
RESPONSE=$(curl -s -w "\n%{http_code}" ${BASE_URL}/login)

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

if [ "$HTTP_CODE" -eq 200 ]; then
    print_result 0 "Listagem funcionando"
    echo "$BODY" | python3 -m json.tool 2>/dev/null || echo "$BODY"
    
    # Verifica se não tem campo password
    if echo "$BODY" | grep -q "password"; then
        print_result 1 "ATENÇÃO: Campo 'password' está sendo retornado!"
    else
        print_result 0 "Confirmado: senhas NÃO são retornadas"
    fi
else
    print_result 1 "Falha ao listar (HTTP $HTTP_CODE)"
    echo "$BODY"
fi
echo ""

# Teste 6: Atualizar senha
print_test "Teste 6: Atualizar senha da Maria"
RESPONSE=$(curl -s -w "\n%{http_code}" -X PUT ${BASE_URL}/login/1 \
  -H "Content-Type: application/json" \
  -d '{"password": "maria456"}')

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

if [ "$HTTP_CODE" -eq 200 ]; then
    print_result 0 "Senha atualizada com sucesso"
    echo "$BODY" | python3 -m json.tool 2>/dev/null || echo "$BODY"
else
    print_result 1 "Falha ao atualizar senha (HTTP $HTTP_CODE)"
    echo "$BODY"
fi
echo ""

# Teste 7: Login com nova senha
print_test "Teste 7: Login Maria com nova senha"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST ${BASE_URL}/login/auth \
  -H "Content-Type: application/json" \
  -d '{"login": "maria@abrigo.com", "password": "maria456"}')

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

if [ "$HTTP_CODE" -eq 200 ]; then
    print_result 0 "Login com nova senha funcionou"
    echo "$BODY" | python3 -m json.tool 2>/dev/null || echo "$BODY"
else
    print_result 1 "Falha no login com nova senha (HTTP $HTTP_CODE)"
    echo "$BODY"
fi
echo ""

# Teste 8: Login com senha antiga (deve falhar)
print_test "Teste 8: Login com senha antiga (deve falhar)"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST ${BASE_URL}/login/auth \
  -H "Content-Type: application/json" \
  -d '{"login": "maria@abrigo.com", "password": "maria123"}')

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

if [ "$HTTP_CODE" -eq 401 ]; then
    print_result 0 "Senha antiga corretamente rejeitada"
    echo "$BODY" | python3 -m json.tool 2>/dev/null || echo "$BODY"
else
    print_result 1 "Deveria rejeitar senha antiga mas retornou HTTP $HTTP_CODE"
    echo "$BODY"
fi
echo ""

# Resumo
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Testes concluídos!${NC}"
echo ""
echo "📊 Resumo:"
echo "  ✓ Cadastro de usuários"
echo "  ✓ Login com credenciais corretas"
echo "  ✓ Rejeição de credenciais incorretas"
echo "  ✓ Listagem sem expor senhas"
echo "  ✓ Atualização de senha"
echo ""
echo "📚 Para mais detalhes, veja: GUIA_POSTMAN_LOGIN.md"

