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

CREATE TABLE status_unidade (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(30) NOT NULL
);

CREATE TABLE cargo (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(50) NOT NULL,
    permisionamento TINYINT NOT NULL
);
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