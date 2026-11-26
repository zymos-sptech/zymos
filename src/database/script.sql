-- ============================================================
-- BANCO DE DADOS ZYMOS - MVP v3 (Atualizado com N:M Lote-Tanque)
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
    statuss TINYINT NOT NULL,
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
    statuss TINYINT NOT NULL,
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
    statuss TINYINT NOT NULL,
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

CREATE TABLE sensor (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fk_unidade INT NOT NULL,
    fk_tanque INT NOT NULL,
    status_sensor TINYINT NOT NULL,
    modelo VARCHAR(20) NOT NULL DEFAULT 'LM35',
    dt_instalacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    dt_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE tanque (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fk_unidade INT NOT NULL,
    fk_sensor INT NULL,
    fk_status_tanque INT NOT NULL DEFAULT 1,
    nome VARCHAR(30) NOT NULL,
    capacidade INT NOT NULL,
    dt_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
    dt_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_tanque_unidade
        FOREIGN KEY (fk_unidade)
        REFERENCES unidade(id),

    CONSTRAINT fk_tanque_sensor
        FOREIGN KEY (fk_sensor)
        REFERENCES sensor(id),

    CONSTRAINT fk_tanque_status
        FOREIGN KEY (fk_status_tanque)
        REFERENCES status_tanque(id),

    CONSTRAINT uq_tanque_unidade
        UNIQUE (fk_unidade, nome)
);

CREATE TABLE lote (
    id INT PRIMARY KEY AUTO_INCREMENT,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    volume_litros INT NOT NULL,
    fk_cerveja INT NOT NULL,
    fk_usuario_criador INT NOT NULL,
    fk_status_lote INT NOT NULL DEFAULT 1,
    dt_inicio DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    dt_fim DATETIME NULL,
    dt_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

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

-- ============================================================
-- TABELA ASSOCIATIVA (Relacionamento N:M entre Lote e Tanque)
-- ============================================================
CREATE TABLE producao (
    fk_lote INT NOT NULL,
    fk_tanque INT NOT NULL,
    dt_entrada DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    dt_saida DATETIME NULL,
    dt_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
        
    PRIMARY KEY (fk_lote, fk_tanque),

    CONSTRAINT fk_lote_tanque_lote
        FOREIGN KEY (fk_lote)
        REFERENCES lote(id),

    CONSTRAINT fk_lote_tanque_tanque
        FOREIGN KEY (fk_tanque)
        REFERENCES tanque(id)
);

CREATE TABLE leitura_sensor (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fk_sensor INT NOT NULL,
    temperatura DECIMAL(4,1) NOT NULL,
    dt_medicao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_leitura_sensor
        FOREIGN KEY (fk_sensor)
        REFERENCES sensor(id)
);

CREATE TABLE alerta (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fk_leitura INT NOT NULL,
    tipo_alerta TINYINT NOT NULL,
    descricao VARCHAR(255),
    dt_alerta DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    dt_resolucao DATETIME NULL,

    CONSTRAINT fk_alerta_leitura
        FOREIGN KEY (fk_leitura)
        REFERENCES leitura_sensor(id)
);

-- ============================================================
-- 3. DADOS DE DOMÍNIO
-- ============================================================

INSERT INTO plano (nome, tanques_min, tanques_max, valor_setup_tanque, valor_mensal_tanque) VALUES
('Básico', 1, 9, 1200.00, 290.00),
('Padrão', 10, 49, 900.00, 240.00),
('Industrial', 50, NULL, 600.00, 190.00);

INSERT INTO cargo (nome, permisionamento) VALUES
('Administrador', 1),
('Mestre Cervejeiro', 2),
('Operador', 3),
('Qualidade', 4);

INSERT INTO tipo_cerveja (tipo) VALUES
('Ale'),
('Lager');

INSERT INTO levedura (nome) VALUES
('Saccharomyces cerevisiae'),
('Saccharomyces pastorianus'),
('Saccharomyces carlsbergensis');

INSERT INTO status_tanque (nome) VALUES
('Disponível'),
('Em uso'),
('Em limpeza'),
('Manutenção'),
('Indisponível');

INSERT INTO status_lote (nome) VALUES
('Em andamento'),
('Finalizado'),
('Cancelado');

INSERT INTO status_unidade (nome) VALUES
('Solicitada / Em Análise'),
('Aguardando Setup Hardware'),
('Ativa'),
('Inativa');

-- ============================================================
-- 4. EMPRESA, UNIDADES E USUÁRIO
-- ============================================================

INSERT INTO empresa (fk_plano, statuss, nome, cnpj, dt_inicio_contrato) VALUES
(2, 1, 'Cervejaria Horizonte', '12345678000190', '2026-01-10');

INSERT INTO codigo_ativacao (fk_empresa, statuss, codigo, dt_expiracao) VALUES
(1, 1, 'ZYMOS-HORIZ-2026', '2026-12-31 23:59:59'), -- Código ativo/disponível
(1, 0, 'ZYMOS-TESTE-0001', '2026-01-31 23:59:59'); -- Código já utilizado ou expirado

INSERT INTO unidade (fk_empresa, fk_status_unidade, quantidade_tanques, cnpj, nome, logradouro, numero, bairro, cidade, uf, cep) VALUES
(1, 3, 4, '12345678000270', 'Matriz Ribeirão Preto', 'Avenida das Cervejarias', '1000', 'Centro', 'Ribeirão Preto', 'SP', '14000000'),
(1, 3, 6, '12345678000350', 'Unidade Campinas', 'Avenida Industrial', '500', 'Distrito Industrial', 'Campinas', 'SP', '13000000');

INSERT INTO usuario (fk_empresa, fk_cargo, statuss, nome, email, senha) VALUES
(1, 1, 1, 'Carlos Silva', 'carlos.silva@cervejariahorizonte.com', 'SUBSTITUIR_POR_HASH_SEGURO');

-- ============================================================
-- 5. CERVEJAS
-- ============================================================

INSERT INTO cerveja (fk_tipo_cerveja, fk_levedura, nome, temperatura_min, temperatura_max, tempo_fermentacao_dias) VALUES
(1, 1, 'IPA', 15.0, 24.0, 14),
(1, 1, 'Red Ale', 15.0, 24.0, 14),
(2, 2, 'Pilsen', 8.0, 14.0, 21);

-- ============================================================
-- 6. TANQUES
-- ============================================================

INSERT INTO tanque (fk_unidade, fk_status_tanque, nome, capacidade) VALUES
(1, 2, 'TQ-01', 10000),
(1, 2, 'TQ-02', 10000),
(1, 1, 'TQ-03', 10000),
(1, 2, 'TQ-04', 10000),
(2, 1, 'TQ-05', 10000),
(2, 1, 'TQ-06', 10000),
(2, 1, 'TQ-07', 10000),
(2, 1, 'TQ-08', 10000),
(2, 1, 'TQ-09', 10000),
(2, 1, 'TQ-10', 10000);

-- ============================================================
-- 7. SENSORES
-- ============================================================

INSERT INTO sensor (fk_unidade, fk_tanque, status_sensor, modelo) VALUES
(1, 1, 1, 'LM35'),
(1, 2, 1, 'LM35'),
(1, 3, 1, 'LM35'),
(1, 4, 1, 'LM35'),
(2, 5, 1, 'LM35'),
(2, 6, 1, 'LM35'),
(2, 7, 1, 'LM35'),
(2, 8, 1, 'LM35'),
(2, 9, 1, 'LM35'),
(2, 10, 1, 'LM35');

-- ============================================================
-- 8. LOTES
-- ============================================================

INSERT INTO lote (codigo, volume_litros, fk_cerveja, fk_usuario_criador, fk_status_lote, dt_inicio, dt_fim) VALUES
('101-A', 8000, 1, 1, 1, '2026-09-23 08:00:00', NULL),
('096',   7000, 2, 1, 1, '2026-09-23 08:00:00', NULL),
('095',   6000, 3, 1, 1, '2026-09-25 08:00:00', NULL),
('087',   7500, 1, 1, 2, '2026-09-01 08:00:00', '2026-09-15 08:00:00');

-- ============================================================
-- 8.1. RELACIONAMENTO LOTE x TANQUE (N:M)
-- ============================================================

INSERT INTO producao (fk_lote, fk_tanque, dt_entrada, dt_saida) VALUES
(100, 1, '2026-09-23 08:00:00', NULL), -- Lote '101-A' no Tanque TQ-01
(101, 2, '2026-09-23 08:00:00', NULL), -- Lote '096' no Tanque TQ-02
(102, 3, '2026-09-25 08:00:00', NULL), -- Lote '095' no Tanque TQ-03
(103, 4, '2026-09-01 08:00:00', '2026-09-15 08:00:00'); -- Lote '087' no Tanque TQ-04

-- ============================================================
-- 9. LEITURAS DE SENSORES
-- ============================================================

INSERT INTO leitura_sensor (fk_sensor, temperatura, dt_medicao) VALUES
(1, 25.2, '2026-09-28 14:32:10'),
(1, 23.8, '2026-09-28 15:00:00');

-- ============================================================
-- 10. ALERTAS
-- ============================================================

INSERT INTO alerta (fk_leitura, tipo_alerta, descricao, dt_alerta, dt_resolucao) VALUES
(1, 1, 'Temperatura acima do limite máximo (24.0°C)', '2026-09-28 14:32:10', NULL);
-- ============================================================
-- 10. CONSULTAR EMPRESA, PLANO E UNIDADES
-- ============================================================

SELECT
    e.nome AS empresa,
    p.nome AS plano,
    u.nome AS unidade,
    u.cnpj,
    u.quantidade_tanques,
    u.cidade,
    u.uf,
    su.nome AS status_unidade
FROM empresa AS e
JOIN plano AS p
    ON p.id = e.fk_plano
JOIN unidade AS u
    ON u.fk_empresa = e.id
JOIN status_unidade AS su
    ON su.id = u.fk_status_unidade
ORDER BY u.nome;

-- ============================================================
-- 11. CONSULTAR TANQUES E UNIDADES
-- ============================================================

SELECT
    u.nome AS unidade,
    t.nome AS tanque,
    t.capacidade,
    st.nome AS status_tanque
FROM tanque AS t
JOIN unidade AS u
    ON u.id = t.fk_unidade
JOIN status_tanque AS st
    ON st.id = t.fk_status_tanque
ORDER BY u.nome, t.nome;

-- ============================================================
-- 12. CONSULTAR LOTES, CERVEJAS, TANQUES E STATUS (ATUALIZADO N:M)
-- ============================================================

SELECT
    l.codigo AS lote,
    c.nome AS cerveja,
    t.nome AS tanque,
    l.volume_litros,
    sl.nome AS status_lote,
    p.dt_entrada,
    p.dt_saida,
    l.dt_inicio,
    l.dt_fim
FROM lote AS l
JOIN cerveja AS c
    ON c.id = l.fk_cerveja
JOIN status_lote AS sl
    ON sl.id = l.fk_status_lote
JOIN producao AS p
    ON p.fk_lote = l.id
JOIN tanque AS t
    ON t.id = p.fk_tanque
ORDER BY l.dt_inicio DESC;

-- ============================================================
-- 13. CONSULTAR HISTÓRICO DE TEMPERATURA DO LOTE 101-A (ATUALIZADO N:M)
-- ============================================================

SELECT
    l.codigo AS lote,
    c.nome AS cerveja,
    t.nome AS tanque,
    ls.temperatura,
    ls.dt_medicao
FROM lote AS l
JOIN cerveja AS c
    ON c.id = l.fk_cerveja
JOIN producao AS p
    ON p.fk_lote = l.id
JOIN tanque AS t
    ON t.id = p.fk_tanque
JOIN sensor AS s
    ON s.fk_tanque = t.id
JOIN leitura_sensor AS ls
    ON ls.fk_sensor = s.id
WHERE l.codigo = '101-A'
  AND ls.dt_medicao >= p.dt_entrada
  AND (p.dt_saida IS NULL OR ls.dt_medicao <= p.dt_saida)
ORDER BY ls.dt_medicao ASC;

-- ============================================================
-- 14. CONSULTAR ALERTAS DO TANQUE TQ-01
-- ============================================================

SELECT
    t.nome AS tanque,
    l.codigo AS lote,
    ls.temperatura,
    a.tipo_alerta,
    a.descricao,
    a.dt_alerta,
    a.dt_resolucao,
    CASE
        WHEN a.dt_resolucao IS NULL THEN 'Aberto'
        ELSE 'Resolvido'
    END AS status_alerta
FROM alerta AS a
JOIN leitura_sensor AS ls
    ON ls.id = a.fk_leitura
JOIN sensor AS s
    ON s.id = ls.fk_sensor
JOIN tanque AS t
    ON t.id = s.fk_tanque
JOIN producao AS p
    ON p.fk_tanque = t.id
JOIN lote AS l
    ON l.id = p.fk_lote
WHERE t.nome = 'TQ-01'
ORDER BY a.dt_alerta DESC;