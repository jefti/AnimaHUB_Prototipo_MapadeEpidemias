create database prototipo;

use prototipo;

-- Tabela de locais registrados (usuários)
CREATE TABLE locais (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    login VARCHAR(100) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    descricao TEXT
);

-- Tabela de doenças
CREATE TABLE doencas (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) UNIQUE NOT NULL,
    color VARCHAR(7) NOT NULL
);

-- Tabela de eventos
CREATE TABLE eventos (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    doenca_id INT UNSIGNED NOT NULL,
    local_id INT UNSIGNED NOT NULL,
    latitude DECIMAL(9,6) NOT NULL,
    longitude DECIMAL(9,6) NOT NULL,
    data_ocorrencia DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (doenca_id) REFERENCES doencas(id) ON DELETE CASCADE,
    FOREIGN KEY (local_id) REFERENCES locais(id) ON DELETE CASCADE
);

CREATE TABLE sessoes (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    local_id INT UNSIGNED NOT NULL,
    token VARCHAR(255) NOT NULL,

    FOREIGN KEY (local_id) REFERENCES locais(id) ON DELETE CASCADE
);

INSERT INTO locais (nome, login, senha_hash, descricao)
VALUES
('Posto de Saúde teste', 'teste', 'teste');

INSERT INTO doencas (nome, color) VALUES
('Dengue', '#e74c3c'),
('Zika', '#f1c40f'),
('Chikungunya', '#8e44ad');