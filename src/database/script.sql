-- ============================================================
-- BANCO DE DADOS ZYMOS - MVP v3
-- Criação das tabelas
-- ============================================================

DROP DATABASE IF EXISTS zymos;
CREATE DATABASE zymos;
USE zymos;

-- ============================================================
-- 1. TABELAS DE DOMÍNIO
-- ============================================================
CREATE TABLE plano (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(20) NOT NULL,
    tanques_min INT NOT NULL,
    tanques_max INT NULL,
    valor_setup_tanque DECIMAL(8,2) NOT NULL,
    valor_mensal_tanque DECIMAL(8,2) NOT NULL
);

CREATE TABLE cargo (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(50) NOT NULL,
    permisionamento TINYINT NOT NULL
);

CREATE TABLE tipo_cerveja (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tipo VARCHAR(20) NOT NULL
);

CREATE TABLE levedura (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL
);

CREATE TABLE status_tanque (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(30) NOT NULL
);

CREATE TABLE status_lote (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(20) NOT NULL
);

CREATE TABLE status_unidade (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(30) NOT NULL
);

select * from cargo;
select * from empresa;
select * from plano;
select * from usuario;

INSERT INTO empresa (fk_plano, status, nome, cnpj, dt_inicio_contrato) VALUES
(1, 1, 'Empresa de testes', 12345678901234, '2026-09-10');
-- ============================================================
-- 2. TABELAS PRINCIPAIS
-- ============================================================

CREATE TABLE contato (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fk_status_contato INT NOT NULL DEFAULT 1,
    qtdtanques INT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    mensagem VARCHAR(500) NULL,
    dt_contato DATETIME DEFAULT CURRENT_TIMESTAMP,
    dt_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE empresa (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fk_plano INT NOT NULL,
    status TINYINT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    cnpj CHAR(14) UNIQUE NOT NULL,
    dt_inicio_contrato DATE NOT NULL,
    dt_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
    dt_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_empresa_plano
        FOREIGN KEY (fk_plano)
        REFERENCES plano(id)
);

CREATE TABLE unidade (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fk_empresa INT NOT NULL,
    fk_status_unidade INT NOT NULL DEFAULT 1,
    quantidade_tanques INT NOT NULL DEFAULT 1,
    cnpj CHAR(14) NOT NULL UNIQUE,
    nome VARCHAR(100) NOT NULL,
    logradouro VARCHAR(150) NOT NULL,
    numero VARCHAR(10) NOT NULL,
    complemento VARCHAR(100) NULL,
    bairro VARCHAR(80) NOT NULL,
    cidade VARCHAR(80) NOT NULL,
    uf CHAR(2) NOT NULL,
    cep CHAR(8) NOT NULL,
    dt_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
    dt_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_unidade_empresa
        FOREIGN KEY (fk_empresa)
        REFERENCES empresa(id),

    CONSTRAINT fk_unidade_status_unidade
        FOREIGN KEY (fk_status_unidade)
        REFERENCES status_unidade(id)
);

CREATE TABLE codigo_ativacao (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fk_empresa INT NOT NULL,
    status TINYINT NOT NULL,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    dt_geracao DATETIME DEFAULT CURRENT_TIMESTAMP,
    dt_expiracao DATETIME NULL,

    CONSTRAINT fk_codigo_empresa
        FOREIGN KEY (fk_empresa)
        REFERENCES empresa(id)
);

CREATE TABLE usuario (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fk_empresa INT NOT NULL,
    fk_cargo INT NOT NULL,
    status TINYINT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    dt_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    dt_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_usuario_empresa
        FOREIGN KEY (fk_empresa)
        REFERENCES empresa(id),

    CONSTRAINT fk_usuario_cargo
        FOREIGN KEY (fk_cargo)
        REFERENCES cargo(id)
);

CREATE TABLE cerveja (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fk_tipo_cerveja INT NOT NULL,
    fk_levedura INT NOT NULL,
    nome VARCHAR(50) NOT NULL,
    temperatura_min DECIMAL(4,1) NOT NULL,
    temperatura_max DECIMAL(4,1) NOT NULL,
    tempo_fermentacao_dias INT NOT NULL,
    dt_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
    dt_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_cerveja_tipo
        FOREIGN KEY (fk_tipo_cerveja)
        REFERENCES tipo_cerveja(id),

    CONSTRAINT fk_cerveja_levedura
        FOREIGN KEY (fk_levedura)
        REFERENCES levedura(id),

    CONSTRAINT chk_cerveja_temperatura
        CHECK (temperatura_min < temperatura_max)
);

CREATE TABLE tanque (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fk_unidade INT NOT NULL,
    fk_status_tanque INT NOT NULL DEFAULT 1,
    nome VARCHAR(30) NOT NULL,
    capacidade INT NOT NULL,
    dt_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
    dt_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_tanque_unidade
        FOREIGN KEY (fk_unidade)
        REFERENCES unidade(id),

    CONSTRAINT fk_tanque_status
        FOREIGN KEY (fk_status_tanque)
        REFERENCES status_tanque(id),

    CONSTRAINT uq_tanque_unidade
        UNIQUE (fk_unidade, nome)
);

CREATE TABLE sensor (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fk_unidade INT NULL,
    fk_tanque INT NULL,
    status_sensor TINYINT NOT NULL,
    modelo VARCHAR(20) NOT NULL DEFAULT 'LM35',
    dt_instalacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    dt_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_sensor_unidade
        FOREIGN KEY (fk_unidade)
        REFERENCES unidade(id),

    CONSTRAINT fk_sensor_tanque
        FOREIGN KEY (fk_tanque)
        REFERENCES tanque(id)
);

CREATE TABLE lote (
    id INT PRIMARY KEY AUTO_INCREMENT,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    volume_litros INT NOT NULL,
    fk_tanque INT NOT NULL,
    fk_cerveja INT NOT NULL,
    fk_usuario_criador INT NOT NULL,
    fk_status_lote INT NOT NULL DEFAULT 1,
    dt_inicio DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    dt_fim DATETIME NULL,
    dt_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_lote_tanque
        FOREIGN KEY (fk_tanque)
        REFERENCES tanque(id),

    CONSTRAINT fk_lote_cerveja
        FOREIGN KEY (fk_cerveja)
        REFERENCES cerveja(id),

    CONSTRAINT fk_lote_usuario
        FOREIGN KEY (fk_usuario_criador)
        REFERENCES usuario(id),

    CONSTRAINT fk_lote_status
        FOREIGN KEY (fk_status_lote)
        REFERENCES status_lote(id)
) AUTO_INCREMENT = 100;

-- A leitura se relaciona diretamente com o sensor.

CREATE TABLE leitura_sensor (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    fk_sensor INT NOT NULL,
    temperatura DECIMAL(4,1) NOT NULL,
    dt_medicao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_leitura_sensor
        FOREIGN KEY (fk_sensor)
        REFERENCES sensor(id)
);

CREATE TABLE alerta (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fk_leitura BIGINT NOT NULL,
    tipo_alerta TINYINT NOT NULL,
    descricao VARCHAR(255),
    dt_alerta DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    dt_resolucao DATETIME NULL,

    CONSTRAINT fk_alerta_leitura
        FOREIGN KEY (fk_leitura)
        REFERENCES leitura_sensor(id)
);