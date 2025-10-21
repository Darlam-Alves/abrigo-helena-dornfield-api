CREATE TABLE LOGIN (
    id SERIAL PRIMARY KEY,
    login VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE MEDICAMENTO (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    dosagem DECIMAL(10,2) NOT NULL,
    unidade_medida VARCHAR(50) NOT NULL,
    principio_ativo VARCHAR(255),
    estoque_minimo INT NOT NULL,
    UNIQUE (nome, dosagem, unidade_medida)
);

CREATE TABLE PACIENTE (
    num_casela INT NOT NULL,
    nome VARCHAR(255) NOT NULL,
    PRIMARY KEY (num_casela)
);

CREATE TABLE ARMARIO (
    num_armario INT PRIMARY KEY,
    categoria VARCHAR(255) NOT NULL,
    descricao VARCHAR(255) NOT NULL
);

CREATE TABLE EQUIPAMENTO (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao VARCHAR(255)
);

CREATE TABLE ESTOQUE_EQUIPAMENTO (
    id SERIAL PRIMARY KEY,
    equipamento_id INT NOT NULL,
    armario_id INT NOT NULL,
    quantidade INT NOT NULL,
    UNIQUE (equipamento_id, armario_id),
    FOREIGN KEY (equipamento_id) REFERENCES equipamento(id),
    FOREIGN KEY (armario_id) REFERENCES armario(num_armario)
);

CREATE TABLE ESTOQUE_MEDICAMENTO (
    id SERIAL PRIMARY KEY,
    medicamento_id INT NOT NULL,
    casela_id INT,
    armario_id INT NOT NULL,
    validade DATE NOT NULL,
    quantidade INT NOT NULL,
    origem VARCHAR(255) NOT NULL,
    tipo VARCHAR(255) NOT NULL,
    FOREIGN KEY (medicamento_id) REFERENCES medicamento(id),
    FOREIGN KEY (casela_id) REFERENCES paciente(num_casela),
    FOREIGN KEY (armario_id) REFERENCES armario(num_armario)
);

CREATE TABLE movimentacao (
    id SERIAL PRIMARY KEY,
    tipo VARCHAR(255) NOT NULL,
    data TIMESTAMP NOT NULL,
    login_id INT NOT NULL,
    equipamento_id INT,
    medicamento_id INT,
    armario_id INT NOT NULL,
    casela_id INT,
    FOREIGN KEY (login_id) REFERENCES login(id),
    FOREIGN KEY (equipamento_id) REFERENCES equipamento(id),
    FOREIGN KEY (medicamento_id) REFERENCES medicamento(id),
    FOREIGN KEY (armario_id) REFERENCES armario(num_armario),
    FOREIGN KEY (casela_id) REFERENCES paciente(num_casela)
);  