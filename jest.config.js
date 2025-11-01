// Configuração do Jest para o projeto

module.exports = {
  // Ambiente de teste
  testEnvironment: 'node',

  // Define NODE_ENV como 'test' durante os testes
  setupFiles: ['<rootDir>/jest.setup.js'],

  // Padrão de arquivos de teste
  testMatch: [
    '**/tests/**/*.test.js',
    '**/tests/**/*.spec.js'
  ],

  // Diretórios a ignorar
  testPathIgnorePatterns: [
    '/node_modules/'
  ],

  // Cobertura de código
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/tests/**',
    '!src/infrastructure/web/main.js',
    '!src/infrastructure/database/connection.js'
  ],

  // Limite de cobertura (opcional - descomente se quiser forçar uma cobertura mínima)
  // coverageThreshold: {
  //   global: {
  //     branches: 80,
  //     functions: 80,
  //     lines: 80,
  //     statements: 80
  //   }
  // },

  // Limpar mocks automaticamente entre os testes
  clearMocks: true,

  // Timeout padrão para testes (em ms)
  testTimeout: 10000,

  // Mensagens de erro mais detalhadas
  verbose: true
};

