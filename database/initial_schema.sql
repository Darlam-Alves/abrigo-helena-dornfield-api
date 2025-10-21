CREATE TABLE LOGIN (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE MEDICAMENTO (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    dosagem DECIMAL(10,2) NOT NULL,
    unidade_medida VARCHAR(50) NOT NULL,
    substancia VARCHAR(255),
    UNIQUE (nome, dosagem, unidade_medida)
);

CREATE TABLE PACIENTE (
    casela INT NOT NULL,
    nome VARCHAR(255) NOT NULL,
    tipo VARCHAR(255) NOT NULL,
    PRIMARY KEY (casela)
);

CREATE TABLE ARMARIO (
    numero INT PRIMARY KEY,
    categoria VARCHAR(255) NOT NULL,
    descricao VARCHAR(255) NOT NULL
);

CREATE TABLE EQUIPAMENTO (
    ID SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao VARCHAR(255)
);

CREATE TABLE ESTOQUE_EQUIPAMENTO (
    ID SERIAL PRIMARY KEY,
    equipamento_ID INT NOT NULL,
    armario_numero INT NOT NULL,
    quantidade INT NOT NULL,
    UNIQUE (equipamento_ID, armario_numero),
    FOREIGN KEY (equipamento_ID) REFERENCES equipamento(ID),
    FOREIGN KEY (armario_numero) REFERENCES armario(numero)
);

CREATE TABLE ESTOQUE_MEDICAMENTO (
    ID SERIAL PRIMARY KEY,
    medicamento_ID INT NOT NULL,
    paciente_casela INT NOT NULL,
    armario_numero INT NOT NULL,
    validade DATE NOT NULL,
    quantidade INT NOT NULL,
    origem VARCHAR(255) NOT NULL,
    FOREIGN KEY (medicamento_ID) REFERENCES medicamento(ID),
    FOREIGN KEY (paciente_casela) REFERENCES paciente(casela),
    FOREIGN KEY (armario_numero) REFERENCES armario(numero)
);

CREATE TABLE movimentacao (
    ID SERIAL PRIMARY KEY,
    tipo VARCHAR(255) NOT NULL,
    data_hora TIMESTAMP NOT NULL,
    usuario_ID INT NOT NULL,
    equipamento_ID INT,
    medicamento_ID INT,
    armario_numero INT NOT NULL,
    casela INT NOT NULL,
    FOREIGN KEY (equipamento_ID) REFERENCES equipamento(ID),
    FOREIGN KEY (medicamento_ID) REFERENCES medicamento(ID),
    FOREIGN KEY (armario_numero) REFERENCES armario(numero),
    FOREIGN KEY (casela) REFERENCES paciente(casela),
    FOREIGN KEY (usuario_ID) REFERENCES login(id)
);